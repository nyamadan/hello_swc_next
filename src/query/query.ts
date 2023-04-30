import { Mutation, Query } from "@/types/generated/graphql";

export const GQL_GET_HOME_PAGE = `#graphql
query Query {
  getHomePage {
    user {
      createdAt
      id
      name
    }
  }
}
`;

export const GQL_GET_USER = `#graphql
query Query($userId: String!) {
  getUser(userId: $userId) {
    createdAt
    id
    name
  }
}
`;

export const GQL_GET_USERS_BY_NAME = `#graphql
query Query($name: String!) {
  getUsersByName(name: $name) {
    createdAt
    id
    name
  }
}
`;

export const GQL_ADD_USER = `#graphql
mutation Mutation($name: String!) {
  addUser(name: $name) {
    createdAt
    id
    name
  }
}
`;

type MyQuerySet = MyQuery<
  typeof GQL_GET_HOME_PAGE,
  Pick<Query, "getHomePage">
> &
  MyQuery<typeof GQL_GET_USERS_BY_NAME, Pick<Query, "getUsersByName">> &
  MyQuery<typeof GQL_GET_USER, Pick<Query, "getUser">, { userId: string }> &
  MyQuery<typeof GQL_ADD_USER, Pick<Mutation, "addUser">, { name: string }>;

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
