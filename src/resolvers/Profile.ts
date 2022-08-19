import { User } from "@prisma/client";
import { Context } from "../index";

interface ProfileParentType {
	id: number;
	bio: string;
	userId: number;
}

// want to query User data in Profile Query
/* like:
query Query($userId: ID!) {
  profile(userId: $userId) {
    id
    bio
    user {
      email
      id
      name
    }
   
  }
}

*/
export const Profile = {
	user: async (parent: ProfileParentType, _: any, { prisma }: Context): Promise<any> => {
		return prisma.user.findUnique({
			where: { id: Number(parent.userId) },
		});
	},
};
