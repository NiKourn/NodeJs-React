export interface IUsers extends Document {
	password: string;
	email: string;
	username: string;
	details?: {
		age?: number;
	};
}
