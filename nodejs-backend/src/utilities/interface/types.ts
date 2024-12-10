export interface Environment {
	isLocal: boolean;
	isDev: boolean;
	isTest: boolean;
	isProd: boolean;
	env: string; // This will be a string that corresponds to the environment name
}
