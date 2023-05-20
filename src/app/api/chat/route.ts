import { PrismaClient } from "@prisma/client";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { NextRequest, NextResponse } from "next/server";
import { schemaPostChat } from "../openai";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

const prompt = new PromptTemplate({
  template: `{context}
上記の文脈を踏まえて、以下の質問に回答してください。回答の際には、上記の文脈に書かれていない情報は可能な限り使わないようにしてください。
質問：{question}
`,
  inputVariables: ["question", "context"],
});

const prisma = new PrismaClient();

function getDistance(
  a: Float32Array,
  b: Float32Array,
  metric: "cosine" | "euclid" = "cosine"
): number {
  switch (metric) {
    case "cosine":
      return (
        1 -
        a.reduce((acc, v, i) => acc + v * b[i], 0) /
          (Math.sqrt(a.reduce((acc, v) => acc + v ** 2, 0)) *
            Math.sqrt(b.reduce((acc, v) => acc + v ** 2, 0)))
      );
    case "euclid":
      return Math.sqrt(a.reduce((acc, v, i) => acc + (v - b[i]) ** 2, 0));
  }
}

async function getContexts(text: string, distance: number) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const vector = Float32Array.from(await embeddings.embedQuery(text));
  const contexts = (await prisma.embedding.findMany())
    .map((x) => ({
      ...x,
      vector: new Float32Array(x.vector.buffer),
    }))
    .map((x) => ({
      ...x,
      distance: getDistance(vector, x.vector),
    }))
    .filter((x) => x.distance > distance)
    .sort((a, b) => {
      if (a.distance < b.distance) {
        return -1;
      } else if (a.distance > b.distance) {
        return 1;
      } else {
        return 0;
      }
    })
    .slice(0, 5);

  return contexts;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, text, distance } = schemaPostChat.parse(await req.json());

    const contexts = distance > 0 ? await getContexts(text, distance) : [];

    messages.unshift({
      role: "system",
      content: `AIアシスタントです。
      多くの質問に回答します。
      日本語で回答します。`,
    });

    if (contexts.length > 0) {
      const content = await prompt.format({
        question: text,
        context: contexts
          .map(({ id, text }) => `文脈${id}: ${text}`)
          .join("\n"),
      });
      messages.push({ role: "user", content });
    } else {
      messages.push({ role: "user", content: text });
    }

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
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
      })
    );

    return NextResponse.json({ text: response.text });
  } catch (e: any) {
    const error = e?.response?.data?.error ?? {};
    const status = e?.response?.statusCode ?? 500;
    return NextResponse.json({ error }, { status });
  }
}
