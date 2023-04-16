import { GetTodoResponse, GetTodosResponse } from "./todo";

type Base<
  URL extends string,
  Response extends Record<string, any> = never,
  Query = never
> = {
  [K in URL]: { query: Query; response: Response };
};

type Info = Base<"/api/todos", GetTodosResponse> &
  Base<"/api/todo", GetTodoResponse, { id: string }>;

export type MyRequestKey = keyof Info;
export type MyRequest = {
  [K in MyRequestKey]: Info[K]["query"] extends never
    ? { url: K }
    : { url: K; query: Info[K]["query"] };
}[MyRequestKey];

export type MyResponse = { [K in keyof Info]: Info[K]["response"] };

export function requestToString(req: MyRequest) {
  const query = (req as { query?: Record<string, any> }).query ?? null;
  return query == null
    ? req.url
    : `${req.url}?${new URLSearchParams(query).toString()}`;
}
