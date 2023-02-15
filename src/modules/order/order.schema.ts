import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const orderInput = {
    status: z.enum(["pending", "completed", "cancelled"], {
        required_error: "Status is required",
        invalid_type_error: "Status pending or completed or cancelled",
    }),
	ownder: z.number({required_error: "Owner id is required" }).int().positive(),
	quantity: z.number({required_error: "Quantity is required" }).int().positive(),
	products: z.array(
		z.object({
			id: z.number({required_error: "Product id is required" }).int().positive(),
		})
	),
	total: z.number().positive(),
};


const orderGenerated = {
	id: z.number().int().positive(),
	...orderInput,
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
};

const orderSchema = z.object({
	...orderInput,
	...orderGenerated,
});

const createOrderSchema = z.object({
	...orderInput,
});

const ordersSchema = z.array(orderSchema);

export type OrderInput = z.infer<typeof createOrderSchema>;

export const { schemas: orderSchemas, $ref } = buildJsonSchemas({
	orderSchema,
	createOrderSchema,
	ordersSchema,
}, { $id: "orderSchemas" });