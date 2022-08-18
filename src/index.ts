import { ApolloServer } from "apollo-server";
import { Query } from "./resolvers";
import { typeDefs } from "./schema";

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: Query,
	},
	csrfPrevention: true,
});

server.listen({ port: 4001 }).then(({ url }: { url: string }) => {
	console.log(`🚀  Server ready at ${url}`);
});
