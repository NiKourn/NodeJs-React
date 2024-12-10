// RUN THIS USING THIS COMMAND: npx ts-node popProductsDb.ts
// This script fetches data from a public API and populates the MongoDB database with the data
import mongoose from 'mongoose';
import { Product } from './src/models/products';
import { slugify } from './src/utilities/functions';

const API_URL = 'https://fakestoreapi.com/products'; // You can replace this with any public API

// Define the Product interface (match this with your Mongoose model)
interface ProductData {
	title: string;
	description: string;
	price: number;
	category: string;
	slug: string;
	image: string;
}

// Fetch and populate the MongoDB database with product data
const fetchAndPopulateData = async () => {
	try {
		// Connect to MongoDB
		await mongoose.connect('mongodb://root:root@localhost:27017/db_app?authSource=admin');

		console.log('Connected to MongoDB');

		// Fetch product data from the API
		const response = await fetch(API_URL);
		const data = (await response.json()) as ProductData[]; // Type the data to match the ProductData interface

		// Insert the data into MongoDB
		for (const productData of data) {
			const categorySlug = slugify(productData.category);
			await Product.create({
				name: productData.title,
				description: productData.description,
				price: productData.price,
				category: productData.category,
				slug: categorySlug,
				imageUrl: productData.image,
			});
			console.log(`Inserted product: ${productData.title}`);
		}

		console.log('Database populated successfully!');
	} catch (err) {
		console.error('Error populating database:', err);
	} finally {
		// Disconnect from the database
		await mongoose.disconnect();
		console.log('Disconnected from MongoDB');
	}
};

fetchAndPopulateData();
