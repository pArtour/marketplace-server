import { FastifyInstance } from "fastify";
import { createUserHandler, getUsersHandler, loginUserHandler } from "./user.controller";
import { $ref } from "./user.schema";

async function userRoute(fastify: FastifyInstance, options: any) {
    fastify.post(
        "/login",
        {
            schema: {
                body: $ref("loginSchema"),
                response: {
                    200: $ref("loginResponseSchema"),
                },
            },
        },
        loginUserHandler
    );

    fastify.post(
        "/",
        {
            schema: {
                body: $ref("createUserSchema"),
                response: {
                    201: $ref("createUserResponseSchema"),
                },
            },
        },
        createUserHandler
    );

    fastify.get(
        "/",
        {
            preHandler: [fastify.authenticate],
            schema: {
                response: {
                    200: $ref("usersResponseSchema"),
                },
            },
        },
        getUsersHandler
    );
}

export default userRoute;
