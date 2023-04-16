import { Query } from "@/types/generated/graphql";

export const GQL_GET_TODO_LIST = `#graphql
query Query {
  getTodoList {
    id
    text
    status
    createdAt
  }
}
`;

type Base<
  Query extends string,
  Response extends Record<string, any>,
  Variables extends Record<string, any> = never
> = {
  [K in Query]: { query: K; variables: Variables; response: Response };
};
type Info = Base<typeof GQL_GET_TODO_LIST, Query>;
export type MyRequest = {
  [K in keyof Info]: Info[K]["variables"] extends never
    ? Pick<Info[K], "query">
    : Pick<Info[K], "query" | "variables">;
}[keyof Info];
export type MyResponse = { [K in keyof Info]: Info[K]["response"] };
