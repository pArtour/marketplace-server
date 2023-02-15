import fastifyJWT from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { withRefResolver } from "fastify-zod";
import { version } from "../package.json";
import { orderSchemas } from "./modules/order/order.schema";
import productRoute from "./modules/product/product.route";
import { productSchemas } from "./modules/product/product.schema";
import userRoute from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

async function buildApp() {
    const app = Fastify({
        logger: {
            level: "info",
        },
        disableRequestLogging: true,
    });

    app.register(fastifyJWT, {
        secret: "asdasdsa",
    });

    app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.send(error);
        }
    });

    app.get("/health-check", async (request, reply) => {
        return reply.status(200).send({ status: "OK" });
    });

    for (const schema of [...userSchemas, ...productSchemas, ...orderSchemas]) {
        app.addSchema(schema);
    }

    await app.register(swagger, {
        swagger: {
            info: {
                title: "Fastify API",
                description: "Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger",
                version,
            },
            externalDocs: {
                url: "https://swagger.io",
                description: "Find more info here",
            },
        },
        openapi: {
            info: {
                title: "Fastify API",
                description: "Building a blazing fast REST API with Node.js, MongoDB, Fastify and Swagger",
                version,
            },
            externalDocs: {
                url: "https://swagger.io",
                description: "Find more info here",
            },
        },
    });

    await app.register(
        swaggerUi,
        withRefResolver({
            routePrefix: "/docs",
            uiConfig: {
                docExpansion: "full",
                deepLinking: false,
                tryItOutEnabled: true,
            },
            uiHooks: {
                onRequest: function (request, reply, next) {
                    next();
                },
                preHandler: function (request, reply, next) {
                    next();
                },
            },
            staticCSP: true,
            transformStaticCSP: (header) => header,
        })
    );

    app.register(userRoute, { prefix: "/api/users" });
    app.register(productRoute, { prefix: "/api/products" });

    return app;
}

export default buildApp;
