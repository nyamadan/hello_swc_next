import z from "zod";

export const ChatGPTAgent = z.enum(["user", "system", "assistant"]);
export type ChatGPTAgentType = z.infer<typeof ChatGPTAgent>;

export const ChatGPTMessage = z.object({
  role: z.enum(["user", "system", "assistant"]),
  content: z.string(),
});
export type ChatGPTMessageType = z.infer<typeof ChatGPTMessage>;

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessageType[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  stop?: string[];
  user?: string;
  n: number;
}

const OpenAIResponseSuccess = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  error: z.undefined(),
  model: z.string(),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
  choices: z.array(
    z.object({
      message: z.object({ role: z.string(), content: z.string() }),
      finish_reason: z.string(),
      index: z.number(),
    })
  ),
});

const OpenAIResponseError = z.object({
  error: z.object({
    message: z.string(),
    type: z.string(),
    param: z.null(),
    code: z.null(),
  }),
});

export const OpenAIResponse = z.union([
  OpenAIResponseSuccess,
  OpenAIResponseError,
]);
