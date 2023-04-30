import { GQL_ADD_USER, GQL_GET_USERS_BY_NAME } from "@/query/query";
import fetchGraphQL from "@/server/fetchGraphQL";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "name",
      credentials: {
        name: {
          label: "name",
        },
      },
      async authorize(credentials) {
        if (!credentials?.name) {
          return null;
        }

        const {
          data: { getUsersByName },
        } = await fetchGraphQL({
          query: GQL_GET_USERS_BY_NAME,
          variables: { name: credentials.name },
        });

        if (getUsersByName.length > 0) {
          const user = getUsersByName[0];
          return {
            id: user.id,
            name: user.name,
          };
        }

        const {
          data: { addUser },
        } = await fetchGraphQL({
          query: GQL_ADD_USER,
          variables: { name: credentials.name },
        });

        return {
          id: addUser.id,
          name: addUser.name,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export function GET(...args: any[]) {
  return handler(...args);
}

export function POST(...args: any[]) {
  return handler(...args);
}
