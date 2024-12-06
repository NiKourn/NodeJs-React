export interface IUsers extends Document {
	password: string;
	email: string;
	details?: {
		age?: number;
	};
}
