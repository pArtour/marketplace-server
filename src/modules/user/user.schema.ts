import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
    email: z
        .string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        })
        .email(),
    name: z.string(),
};
const createUserSchema = z.object({
    ...userCore,
    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",		
    }).min(6, {
		message: "Password must be at least 6 characters",
	}),

});

const createUserResponseSchema = z.object({
    id: z.number(),
    ...userCore,
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;

const loginResponseSchema = z.object({ 
    token: z.string(),
});

const usersResponseSchema = z.array(
    z.object({
        id: z.number(),
        email: z.string(),
        name: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
    })
);



export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema,
    usersResponseSchema,
}, { $id: "userSchemas" });

export type CreateUserInput = z.infer<typeof createUserSchema>;
