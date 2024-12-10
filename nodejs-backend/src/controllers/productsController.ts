import { Request, Response } from 'express';
import { Product } from '../models/products';

/**
 * Retrieves all users from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response containing the list of users or an error message.
 */
export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await Product.find();
		const countProducts = await Product.countDocuments();

		res.status(200).json({
			totalCount: countProducts, // Include the product count outside the array
			status: true,
			data: products, // Include the array of products
		});
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error });
	}
};
