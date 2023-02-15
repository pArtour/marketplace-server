import fastifyJWT from "@fastify/jwt";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import buildApp from "./app";
import productRoute from "./modules/product/product.route";
import userRoute from "./modules/user/user.route";

declare module "fastify" {
    export interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: number;
            name: string;
            email: string;
        };
    }
}

async function main() {
    const app = await buildApp();

    try {
        await app.listen({
            port: 3000,
            host: "0.0.0.0",
        });

        console.log("Server started at http://localhost:3000");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

main();
