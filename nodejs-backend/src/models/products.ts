import { prisma } from '../lib/prisma'
import { Product, Prisma } from '@prisma/client'

export class ProductModel {
	// Create a new product
	static async create(productData: Prisma.ProductCreateInput): Promise<Product> {
		return await prisma.product.create({
			data: productData,
		})
	}

	// Find product by ID
	static async findById(id: number): Promise<Product | null> {
		return await prisma.product.findUnique({
			where: { id },
		})
	}

	// Find product by slug
	static async findBySlug(slug: string): Promise<Product | null> {
		return await prisma.product.findUnique({
			where: { slug },
		})
	}

	// Get all products
	static async findAll(): Promise<Product[]> {
		return await prisma.product.findMany()
	}

	// Find products by category
	static async findByCategory(category: string): Promise<Product[]> {
		return await prisma.product.findMany({
			where: { category },
		})
	}

	// Update product
	static async update(id: number, productData: Prisma.ProductUpdateInput): Promise<Product> {
		return await prisma.product.update({
			where: { id },
			data: productData,
		})
	}

	// Delete product
	static async delete(id: number): Promise<Product> {
		return await prisma.product.delete({
			where: { id },
		})
	}

	// Search products by name
	static async search(searchTerm: string): Promise<Product[]> {
		return await prisma.product.findMany({
			where: {
				OR: [
					{ name: { contains: searchTerm, mode: 'insensitive' } },
					{ description: { contains: searchTerm, mode: 'insensitive' } },
				],
			},
		})
	}
}
