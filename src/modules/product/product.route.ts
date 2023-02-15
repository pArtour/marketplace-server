import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoute(fastify: FastifyInstance, options: any) {
    fastify.get("/", {
		preHandler: [fastify.authenticate],
		schema: {
			response: {
				200: $ref("productsResponseSchema"),
			},
		},
	}, getProductsHandler);

    fastify.post(
        "/",
        {
            preHandler: [fastify.authenticate],
            schema: {
                body: $ref("createProductSchema"),
                response: {
                    201: $ref("productResponseSchema"),
                },
            },
        },
        createProductHandler
    );
}

export default productRoute;
