import { Context } from "../index";

interface PostParentType {
	// quiero extraer del model Post authorId
	authorId: number;
}

/*
query Posts {
  posts {
    id
    title
    content
    published
    user {
      name
      id
      email
    }
  }
}
*/

export const Post = {
	user: async (parent: PostParentType, _: any, { prisma }: Context): Promise<any> => {
		// console.log(parent, "parent");
		/* parent
    {
      id: 2,
      title: 'UPDATED POST TITLE',
      content: 'JWT UPDATED',
      authorId: 5,
      published: true,
      createdAt: 2022-08-18T20:28:04.965Z,
      updatedAt: 2022-08-19T14:35:24.389Z
    } 
     */
		return prisma.user.findUnique({
			where: { id: Number(parent.authorId) },
		});
	},
};
