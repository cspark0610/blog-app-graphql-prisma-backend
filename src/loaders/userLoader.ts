import { User } from "@prisma/client";
import Dataloader from "dataloader";
import { prisma } from "../index";

type BatchUser = (ids: number[]) => Promise<User[]>;

/*
DataLoader creates a public API for loading data from a particular data back-end with unique keys 
such as the id column of a SQL table or document name in a MongoDB database, given a batch loading function.

Each DataLoader instance contains a unique memoized cache.
Use caution when used in long-lived applications or those 
which serve many users with different access permissions and consider creating a new instance per web request.
*/

// pass as args array of ids[ 8, 9,10] => [ {user with id 8 }, {user with id 9 }, {user with id 10 } ]
export const batchUsers: BatchUser = async (ids) => {
	// console.log(ids, "ids");
	const users = await prisma.user.findMany({
		where: {
			id: { in: ids },
		},
	});

	const userMap: { [key: string]: User } = {};

	users.forEach((user) => {
		userMap[user.id] = user;
	});
	// { "8": {user with id 8 }, "9": {user with id 9 }, "10": {user with id 10 } }

	return ids.map((id) => userMap[id]);
	// [ { "8": {user with id 8 }, "9": {user with id 9 }, "10": {user with id 10 } }]
};

// @ts-ignore
export const userLoader = new Dataloader<number, User>(batchUsers);
