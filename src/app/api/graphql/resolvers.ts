import {
  MutationResolvers,
  QueryResolvers,
  Resolvers,
} from "@/types/generated/graphql";
import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { ulid } from "ulid";
import { authOptions } from "../auth/[...nextauth]/route";
const prisma = new PrismaClient();

const Query: QueryResolvers = {
  getUser: async (_, { userId }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    return {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  },
  getUsersByName: async (_, { name }) => {
    const users = await prisma.user.findMany({
      where: {
        name,
      },
      take: 100,
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    }));
  },
  getHomePage: async (_) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id ?? null;
    const user =
      userId != null
        ? await prisma.user.findUniqueOrThrow({
            where: {
              id: userId,
            },
          })
        : null;

    if (user != null) {
      return {
        user: {
          id: user.id,
          name: user.name,
          createdAt: user.createdAt.toISOString(),
        },
      };
    } else {
      return {
        user: null,
      };
    }
  },
};

const Mutation: MutationResolvers = {
  addUser: async (_, { name }) => {
    const data: Prisma.UserUncheckedCreateInput = {
      id: ulid(),
      name,
    };

    const users = await prisma.user.create({ data });
    return {
      ...users,
      createdAt: users.createdAt.toISOString(),
    };
  },
  updateUser: async (_, { id, name }) => {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: name ?? undefined,
      },
    });

    return {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  },
};

const resolvers: Resolvers = { Query, Mutation };

export default resolvers;
