import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JWT_SECRET } from "../../keys";

//crfeear interfaces para los inputs y para el return de la funcion
interface SignupArgs {
	credentials: {
		email: string;
		password: string;
	};
	name: string;
	bio: string;
}

interface LoginArgs {
	credentials: {
		email: string;
		password: string;
	};
}

interface UserPayload {
	userErrors: { message: string }[];
	token: string | null;
}

export const authResolvers = {
	signup: async (
		_: any,
		{ name, credentials: { email, password }, bio }: SignupArgs,
		{ prisma }: Context
	): Promise<UserPayload> => {
		const isEmail = validator.isEmail(email);
		if (!isEmail) {
			return {
				userErrors: [{ message: "Email is invalid" }],
				token: null,
			};
		}
		const isValidPassword = validator.isLength(password, { min: 6 });
		if (!isValidPassword) {
			return {
				userErrors: [{ message: "Password must be at least 6 characters" }],
				token: null,
			};
		}
		if (!name || !bio) {
			return {
				userErrors: [{ message: "Name and bio are required" }],
				token: null,
			};
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				profile: {
					create: {
						bio,
					},
				},
			},
		});
		const token = JWT.sign({ userId: user.id, email }, JWT_SECRET, {
			expiresIn: "3d",
		});

		return {
			userErrors: [],
			token,
		};
	},

	login: async (
		_: any,
		{ credentials: { email, password } }: LoginArgs,
		{ prisma }: Context
	): Promise<UserPayload> => {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return {
				userErrors: [{ message: "Invalid credentials" }],
				token: null,
			};
		}
		// compare password with hashed password
		const passwordMatches: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatches) {
			return {
				userErrors: [{ message: "Invalid credentials" }],
				token: null,
			};
		}
		//generate token
		const token = JWT.sign({ userId: user.id, email }, JWT_SECRET, {
			expiresIn: "3d",
		});

		return {
			userErrors: [],
			token,
		};
	},
};
