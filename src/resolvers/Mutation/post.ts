import { Post } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
	post: {
		title: string;
		content: string;
	};
}

interface PostPayloadType {
	userErrors: { message: string }[];
	post: Post | null;
}

export const postResolvers = {
	postCreate: async (
		parent: any,
		{ post: { title, content } }: PostArgs,
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [{ message: "You must be logged in to create a post" }],
				post: null,
			};
		}

		if (!title || !content) {
			return {
				userErrors: [{ message: "Title and content are required to create a post" }],
				post: null,
			};
		}
		const data = { title, content, authorId: userInfo.userId };
		const post = await prisma.post.create({ data });

		return {
			userErrors: [],
			post,
		};
	},

	postUpdate: async (
		parent: any,
		{ post, postId }: { postId: string; post: PostArgs["post"] },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [{ message: "You must be logged in to update a post" }],
				post: null,
			};
		}
		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});
		if (error) return error;

		const { title, content } = post;

		if (!title && !content) {
			return {
				userErrors: [{ message: "Title or content are required at least to update a post" }],
				post: null,
			};
		}

		const postExists = await prisma.post.findUnique({
			where: { id: Number(postId) },
		});
		if (!postExists) {
			return {
				userErrors: [{ message: "Post not found to update, does not exists" }],
				post: null,
			};
		}

		const payloadToUpdate: Partial<PostArgs["post"]> = { title, content };
		if (!title) delete payloadToUpdate.title;
		if (!content) delete payloadToUpdate.content;

		const postUpdated: Post = await prisma.post.update({
			where: { id: Number(postId) },
			data: { ...payloadToUpdate },
		});

		return {
			userErrors: [],
			post: postUpdated,
		};
	},

	postDelete: async (
		parent: any,
		{ postId }: { postId: string },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [{ message: "You must be logged in to delete a post" }],
				post: null,
			};
		}
		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});
		if (error) return error;

		const postExists = await prisma.post.findUnique({
			where: { id: Number(postId) },
		});
		if (!postExists) {
			return {
				userErrors: [{ message: "Post not found to delete, does not exists" }],
				post: null,
			};
		}

		const postDeleted: Post = await prisma.post.delete({
			where: { id: Number(postId) },
		});

		return {
			userErrors: [],
			post: postDeleted,
		};
	},
	postPublish: async (
		_: any,
		{ postId }: { postId: string },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [{ message: "You must be logged in to publish a post" }],
				post: null,
			};
		}
		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});
		if (error) return error;
		const post = await prisma.post.update({
			where: { id: Number(postId) },
			data: { published: true },
		});
		return {
			userErrors: [],
			post,
		};
	},

	postUnpublish: async (
		_: any,
		{ postId }: { postId: string },
		{ prisma, userInfo }: Context
	): Promise<PostPayloadType> => {
		if (!userInfo) {
			return {
				userErrors: [{ message: "You must be logged in to unpublish a post" }],
				post: null,
			};
		}
		const error = await canUserMutatePost({
			userId: userInfo.userId,
			postId: Number(postId),
			prisma,
		});
		if (error) return error;
		const post = await prisma.post.update({
			where: { id: Number(postId) },
			data: { published: false },
		});
		return {
			userErrors: [],
			post,
		};
	},
};
