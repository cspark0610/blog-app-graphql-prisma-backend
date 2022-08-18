import { gql } from "apollo-server";

export const typeDefs = gql`
	type Query {
		posts: [Post!]!
	}

	input PostInput {
		title: String
		content: String
	}

	type Mutation {
		postCreate(post: PostInput!): PostPayload!
		postUpdate(postId: ID!, post: PostInput!): PostPayload!
		postDelete(postId: ID!): PostPayload!
	}

	type PostPayload {
		userErrors: [UserError!]
		post: Post
	}

	type UserError {
		message: String!
	}

	type Post {
		id: ID!
		title: String!
		content: String!
		published: Boolean!
		createdAt: String!
		user: User!
	}

	type User {
		id: ID!
		name: String
		email: String!
		posts: [Post!]!
		profile: Profile!
	}

	type Profile {
		id: ID!
		bio: String!
		user: User!
	}
`;
