import { CreateUserInput, LoginInput } from "./user.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { comparePassword, createUser, findUsers, getUserByEmail } from "./user.service";

export async function createUserHandler(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const body = request.body;
    try {
        const user = await createUser(body);
        return reply.status(201).send(user);
    } catch (error) {
        console.log(error);
        // TODO: Handle error properly here
        return reply.status(500).send({ message: `Internal server error: ${(error as Error).message}` });
    }
}

export async function loginUserHandler(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    const { email, password } = request.body;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return reply.status(404).send({ message: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (isMatch) {
            const { password, salt, ...userWithoutPassword } = user;
            const token = await request.server.jwt.sign({ ...userWithoutPassword });

            return reply.status(200).send({ token });
        }

        return reply.status(401).send({ message: "Invalid credentials" });
    } catch (error) {
        console.log(error);
    }
}

export async function getUsersHandler(request: FastifyRequest, reply: FastifyReply) {
    const users = await findUsers();

    return users;
}
