import { ApolloServer } from "apollo-server";
import { Query, Mutation } from "./resolvers";
import { typeDefs } from "./schema";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export interface Context {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
	>;
}

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: Query,
		Mutation: Mutation,
	},
	context: {
		prisma,
	},
	csrfPrevention: true,
});

server.listen({ port: 4001 }).then(({ url }: { url: string }) => {
	console.log(`🚀  Server ready at ${url}`);
});
