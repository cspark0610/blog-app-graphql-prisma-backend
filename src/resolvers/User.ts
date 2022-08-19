import { Post } from "@prisma/client";
import { Context } from "../index";

interface UserParentType {
	id: number;
}

/*
quiero los Posts anidados de un user al usar la query Profile

query Query($userId: ID!) {
  profile(userId: $userId) {
    id
    bio
    user {
      email
      id
      name
      posts {
        id
        content
        title
      }
    }
   
  }
}
*/

// porque en el model tengo User { posts: Post[] }
export const User = {
	posts: async (parent: UserParentType, _: any, { prisma, userInfo }: Context): Promise<Post[]> => {
		const isOwnProfile = userInfo?.userId === parent.id;

		if (isOwnProfile) {
			return prisma.post.findMany({
				where: {
					authorId: parent.id,
				},
				orderBy: [{ createdAt: "desc" }],
			});
		} else {
			return prisma.post.findMany({
				where: {
					authorId: parent.id,
					published: true,
				},
				orderBy: [{ createdAt: "desc" }],
			});
		}
	},
};
