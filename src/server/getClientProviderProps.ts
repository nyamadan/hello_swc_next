import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";
import fetchGraphQL from "./fetchGraphQL";

export default async function getClientProviderProps(
  queries: (session: Session | null) => ReturnType<typeof fetchGraphQL>[]
) {
  const session = await getServerSession(authOptions);
  const responses = await Promise.all(queries(session));
  const fallback: Record<string, any> = {};
  for (const { key, data } of responses) {
    fallback[key] = data;
  }

  return { fallback, session };
}
