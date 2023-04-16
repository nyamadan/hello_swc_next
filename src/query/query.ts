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

type MyQuerySet = MyQuery<typeof GQL_GET_TODO_LIST, Query>;

type MyQuery<
  Query extends string,
  Response extends Record<string, any>,
  Variables extends Record<string, any> = never
> = {
  [K in Query]: { query: K; variables: Variables; response: Response };
};
export type MyRequest = {
  [K in keyof MyQuerySet]: MyQuerySet[K]["variables"] extends never
    ? Pick<MyQuerySet[K], "query">
    : Pick<MyQuerySet[K], "query" | "variables">;
}[keyof MyQuerySet];
export type MyResponse = { [K in keyof MyQuerySet]: MyQuerySet[K]["response"] };
