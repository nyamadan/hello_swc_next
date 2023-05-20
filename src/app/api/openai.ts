import z from "zod";

export const ChatGPTAgent = z.enum(["user", "system", "assistant"]);
export type ChatGPTAgentType = z.infer<typeof ChatGPTAgent>;

export const ChatGPTMessage = z.object({
  role: ChatGPTAgent,
  content: z.string(),
});
export type ChatGPTMessageType = z.infer<typeof ChatGPTMessage>;

export const schemaPostChat = z.object({
  text: z.string().min(1),
  messages: z.array(ChatGPTMessage),
  distance: z.number().gte(0),
});
