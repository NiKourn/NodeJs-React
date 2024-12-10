import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
	name: string;
	description: string;
	price: number;
	category: string;
	slug: string;
	imageUrl: string;
}

const productSchema: Schema<IProduct> = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	category: { type: String, required: true },
	slug: { type: String, required: true },
	imageUrl: { type: String, required: true },
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
