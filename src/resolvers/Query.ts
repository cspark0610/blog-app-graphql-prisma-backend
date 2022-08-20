import { Post, User } from "@prisma/client";
import { Context } from "../index";

export const Query = {
	posts: async (_: any, __: any, { prisma }: Context): Promise<Post[]> => {
		return prisma.post.findMany({
			orderBy: [{ createdAt: "desc" }],
		});
	},

	me: async (_: any, __: any, { prisma, userInfo }: Context) => {
		if (!userInfo) return null;

		return prisma.user.findUnique({
			where: {
				id: userInfo.userId,
			},
		});
	},

	// mutacion publica no es necesario pasar un token dentro del headers, cualq user no authenthicado puede ver el profile de cualq user
	profile: async (_: any, { userId }: { userId: string }, { prisma, userInfo }: Context) => {
		const isMyProfile = Number(userId) === userInfo!.userId;

		// we set userId in Profile model as @unique directive so we can use prisma FindUnique method
		const profile = await prisma.profile.findUnique({
			where: { userId: Number(userId) },
			// "include" permitira anidar la query y poedir los datos del user
			// include: { user: true },
		});
		if (!profile) return null;

		return {
			...profile,
			isMyProfile,
		};
	},
};
