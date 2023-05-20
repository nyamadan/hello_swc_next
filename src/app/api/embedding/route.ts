import { Embedding, PrismaClient } from "@prisma/client";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { NextRequest, NextResponse } from "next/server";
import { ulid } from "ulid";
import z from "zod";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

const prisma = new PrismaClient();

export async function GET(_: NextRequest) {
  const embeddings = await prisma.embedding.findMany();
  return NextResponse.json({
    embeddings: embeddings.map((x) => {
      return {
        ...x,
        vector: Array.from(new Float32Array(x.vector.buffer)),
      };
    }),
  });
}

function chunkString(str: string, chunkLength: number = 400): string[] {
  const chunks: string[] = [];
  let index = 0;
  while (index < str.length) {
    chunks.push(str.slice(index, index + chunkLength));
    index += chunkLength;
  }
  return chunks;
}

export const schemaPostEmbedding = z.union([
  z.object({
    type: z.literal("text"),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal("url"),
    url: z.string().url(),
  }),
]);

export async function POST(req: NextRequest) {
  const params = schemaPostEmbedding.parse(await req.json());
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const text =
    params.type === "text"
      ? params.text
      : await (await fetch(params.url, { cache: "no-store" })).text();
  const textChunks = chunkString(text);
  const vectors = await embeddings.embedDocuments(textChunks);

  const results: Embedding[] = [];
  for (let i = 0; i < textChunks.length; i += 1) {
    const vector = Float32Array.from(vectors[i]);
    const embedding = await prisma.embedding.create({
      data: {
        id: ulid(),
        text: textChunks[i],
        vector: Buffer.from(vector.buffer),
      },
    });
    results.push(embedding);
  }
  return NextResponse.json({ text: text, results });
}
