import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
import {hash, compare, genSalt} from 'bcrypt';


export async function createUser(input: CreateUserInput) {
	const salt = await genSalt(16);
	const hashedPassword = await hash(input.password, salt);

    const user = await prisma.user.create({
        data: { ...input, salt, password: hashedPassword },
    });

    return user;
}

export async function getUserById(id: number) {
	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	});

	return user;
}

export async function getUserByEmail(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	return user;
}


export async function comparePassword(password: string, hashedPassword: string) {
	const isMatch = await compare(password, hashedPassword);

	return isMatch;
}

export async function findUsers() {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		}
	});

	return users;
}