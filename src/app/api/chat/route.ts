import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { ChatGPTMessage } from "./openai";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const runtime = "edge";

const handler = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();

  const messages: z.infer<typeof ChatGPTMessage>[] = [
    {
      role: "system",
      content: `AIアシスタントです。
      多くの質問に回答します。
      日本語で回答します。`,
    },
  ];
  messages.push(...body?.messages);

  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY ?? "",
    modelName: "gpt-3.5-turbo",
    temperature: process.env.AI_TEMP ? Number(process.env.AI_TEMP) : 0.7,
    maxTokens: process.env.AI_MAX_TOKENS
      ? Number(process.env.AI_MAX_TOKENS)
      : 100,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    streaming: false,
    n: 1,
  });

  const response = await chat.call(
    messages.map((message) => {
      const { role, content } = message;
      switch (role) {
        case "user": {
          return new HumanChatMessage(content);
        }
        case "assistant": {
          return new AIChatMessage(content);
        }
        case "system": {
          return new SystemChatMessage(content);
        }
        default: {
          throw new Error(`Unknown role: ${role}`);
        }
      }
    } )
  );

  return NextResponse.json({ text: response.text });
};

export function POST(req: NextRequest) {
  return handler(req);
}
