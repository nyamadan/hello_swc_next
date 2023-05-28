import type { Mutation, Query } from "@/types/generated/graphql";
import * as gql from "gql-query-builder";
import type GqlFields from "gql-query-builder/build/Fields";

const USER_FIELDS = ["createdAt", "id", "name"] as const;

export const GQL_GET_HOME_PAGE = gql.query({
  operation: "getHomePage",
  fields: [
    {
      user: USER_FIELDS,
    },
  ],
}).query as string & { __GQL_GET_HOME_PAGE: never };

export const GQL_GET_USER = gql.query({
  operation: "getUser",
  fields: USER_FIELDS as unknown as GqlFields,
  variables: { userId: { value: "", required: true } },
}).query as string & { __GQL_GET_USER: never };

export const GQL_GET_USERS_BY_NAME = gql.query({
  operation: "getUsersByName",
  fields: USER_FIELDS as unknown as GqlFields,
  variables: { name: { value: "", required: true } },
}).query as string & { __GQL_GET_USERS_BY_NAME: never };

export const GQL_ADD_USER = gql.mutation({
  operation: "addUser",
  fields: USER_FIELDS as unknown as GqlFields,
  variables: { name: { value: "", required: true } },
}).query as string & { __GQL_ADD_USER: never };

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
