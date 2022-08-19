import { Context } from "../index";

interface CanUserMutatePostParams {
	userId: number;
	postId: number;
	prisma: Context["prisma"];
}

export const canUserMutatePost = async ({ userId, postId, prisma }: CanUserMutatePostParams) => {
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		return {
			userErrors: [{ message: "user not found" }],
			post: null,
		};
	}
	// find post to update
	const post = await prisma.post.findUnique({ where: { id: postId } });

	if (post?.authorId !== user.id) {
		return {
			userErrors: [{ message: "Post is not owned by user logged in" }],
			post: null,
		};
	}
};
