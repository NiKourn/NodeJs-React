// RUN THIS USING THIS COMMAND: npm run seed
// OR: npx ts-node -r tsconfig-paths/register popProductsDb.ts
// This script fetches data from a public API and populates the PostgreSQL database with the data
import { PrismaClient } from '@prisma/client'
import { slugify } from '@/utilities/functions'

const prisma = new PrismaClient()
const API_URL = 'https://fakestoreapi.com/products' // You can replace this with any public API

// Define the Product interface (match this with your API response)
interface ProductData {
	title: string
	description: string
	price: number
	category: string
	slug: string
	image: string
}

// Fetch and populate the PostgreSQL database with product data
const fetchAndPopulateData = async () => {
	try {
		// Test database connection
		await prisma.$connect()
		console.log('Connected to PostgreSQL')

		// Fetch product data from the API
		const response = await fetch(API_URL)
		const data = (await response.json()) as ProductData[] // Type the data to match the ProductData interface

		// Insert the data into PostgreSQL
		for (const productData of data) {
			const productSlug = slugify(productData.title)
			await prisma.product.upsert({
				where: { slug: productSlug },
				update: {
					name: productData.title,
					description: productData.description,
					price: productData.price,
					category: productData.category,
					imageUrl: productData.image,
				},
				create: {
					name: productData.title,
					description: productData.description,
					price: productData.price,
					category: productData.category,
					slug: productSlug,
					imageUrl: productData.image,
				},
			})
			console.log(`Upserted product: ${productData.title}`)
		}

		console.log('Database populated successfully!')
	} catch (err) {
		console.error('Error populating database:', err)
	} finally {
		// Disconnect from the database
		await prisma.$disconnect()
		console.log('Disconnected from PostgreSQL')
	}
}

fetchAndPopulateData()
