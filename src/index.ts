import { ApolloServer } from "apollo-server";
import { Query, Mutation, Profile, Post, User } from "./resolvers";
import { typeDefs } from "./schema";
import { PrismaClient, Prisma } from "@prisma/client";
import { getUserFromToken } from "./utils/getUserFromToken";

const prisma = new PrismaClient({
	//log: ["query"],
});

export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;
	userInfo: {
		userId: number;
	} | null;
}

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: Query,
		Mutation: Mutation,
		Profile: Profile,
		Post: Post,
		User: User,
	},
	context: async ({ req }: any): Promise<Context> => {
		const userInfo = await getUserFromToken(req.headers.authorization);
		return { prisma, userInfo };
	},
	csrfPrevention: true,
});

server.listen({ port: 4001 }).then(({ url }: { url: string }) => {
	console.log(`🚀  Server ready at ${url}`);
});
