import { gql } from "apollo-server";

export const typeDefs = gql`
	type Query {
		me: User
		posts: [Post!]!
		# quiero retornar el type Profile para la query Profile
		profile(userId: ID!): Profile!
	}

	input PostInput {
		title: String
		content: String
	}

	type Mutation {
		postCreate(post: PostInput!): PostPayload!
		postUpdate(postId: ID!, post: PostInput!): PostPayload!
		postDelete(postId: ID!): PostPayload!
		postPublish(postId: ID!): PostPayload!
		postUnpublish(postId: ID!): PostPayload!
		signup(name: String!, credentials: CredentialsInput!, bio: String!): AuthPayload!
		login(credentials: CredentialsInput!): AuthPayload!
	}

	input CredentialsInput {
		email: String!
		password: String!
	}

	type AuthPayload {
		userErrors: [UserError!]!
		token: String
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
		# bad design approach
		# profile: Profile!
		# lo que quiero es hacer una query al Profile y de ahi sacar la info del User
	}

	type Profile {
		id: ID!
		bio: String!
		user: User!
	}
`;
