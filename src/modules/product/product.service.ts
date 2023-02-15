import { Product } from "@prisma/client";
import prisma from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(data: CreateProductInput, ownerId: number): Promise<Product> {
    console.log({ownerId: ownerId});
    
	const product = await prisma.product.create({
		data: {
			...data,
			ownerId
		},
	});

	return product;
}

export async function getProducts() {
	const products = await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            price: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

	return products;
}