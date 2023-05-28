import { MyRequest, MyResponse } from "@/query/query";
import { cookies as getCookies } from "next/headers";

export default async function fetchGraphQL<Req extends MyRequest>(req: Req) {
  const cookie = getCookies();
  const body = JSON.stringify(req);
  const response = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie.toString(),
    },
    body,
    cache: "no-store",
  });
  const { data } = (await response.json()) as {
    data?: MyResponse[Req["query"]];
  };
  return { key: body, data };
}
