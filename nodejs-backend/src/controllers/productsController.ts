import { Request, Response } from 'express'
import { ProductModel } from '../models/products'

/**
 * Retrieves all products from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the list of products or an error message.
 */
export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await ProductModel.findAll()
		const countProducts = products.length // With Prisma, we get the count from the array length

		res.status(200).json({
			totalCount: countProducts, // Include the product count outside the array
			status: true,
			data: products, // Include the array of products
		})
	} catch (error) {
		res.status(500).json({ message: 'Error fetching products', error })
	}
}
