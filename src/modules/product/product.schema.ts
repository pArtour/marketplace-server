import {z} from "zod";
import {buildJsonSchemas} from "fastify-zod";

const productInput = {
	title: z.string(),
	description: z.string().optional(),
	price: z.number(),
}

const productGenerated = {
	id: z.number(),
	ownerId: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
}

const createProductSchema = z.object({
	...productInput,
});

const productResponseSchema = z.object({
    ...productGenerated,
    ...productInput,
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const {schemas: productSchemas, $ref} = buildJsonSchemas({
	createProductSchema,
	productResponseSchema,
	productsResponseSchema,
}, {$id: "productSchemas"});