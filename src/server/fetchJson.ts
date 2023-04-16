import { MyRequest, MyResponse, requestToString } from "@/response/responses";

export default async function fetchJson<T extends MyRequest>(
  req: T
): Promise<MyResponse[T["url"]]> {
  const url = new URL(requestToString(req), "http://localhost:3000");
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
