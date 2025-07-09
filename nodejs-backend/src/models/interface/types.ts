import { User, Product } from '@prisma/client'

// Use Prisma's generated types but extend them if needed
export type IUsers = User & {
	details?: {
		age?: number
	} | null
}

export type IProduct = Product
