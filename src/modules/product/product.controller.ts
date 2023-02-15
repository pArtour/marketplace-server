import { CreateProductInput } from "./product.schema";
import { FastifyRequest, FastifyReply } from "fastify";
import { getProducts, createProduct } from "./product.service";

export async function getProductsHandler(request: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send(await getProducts());
}

export async function createProductHandler(request: FastifyRequest<{ Body: CreateProductInput }>, reply: FastifyReply) {
    console.log(request.user.id);
    
    try {
        const product = await createProduct(
            {
                ...request.body,
            },
            request.user.id
        );
        return reply.status(201).send(product);
    } catch (error) {
        return reply.status(500).send({ message: `Internal server error: ${(error as Error).message}` });
    }
}
