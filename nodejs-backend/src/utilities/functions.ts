import { AppConstants } from '../enums/appConstants';

/**
 * Get the environment based on the host.
 *
 * @param {string} host - The host name of the server. Usually request headers ->> req.headers.host.
 * @returns {AppConstants} - The environment constant.
 */
export const getEnvironment = (host: string): AppConstants => {
	if (host.includes('localhost')) {
		return AppConstants.TESTING_ENV;
	} else if (host.includes('dev')) {
		return AppConstants.DEVELOPMENT_ENV;
	} else if (host.includes('test')) {
		return AppConstants.STAGING_ENV;
	} else if (host.includes('yourapp.com')) {
		return AppConstants.PRODUCTION_ENV;
	}

	// Fallback environment
	return AppConstants.TESTING_ENV;
};

/**
 * Get the base URL for the API based on the environment.
 *
 * @param {string} host - The host name of the server. Usually request headers ->> req.headers.host.
 * @returns {string} - The base URL for the API.
 */
export const getApiBaseUrl = (host: string): string => {
	const environment = getEnvironment(host);

	switch (environment) {
		case AppConstants.PRODUCTION_ENV:
			return AppConstants.API_PROD_URL;
		case AppConstants.STAGING_ENV:
			return AppConstants.API_STAGING_URL;
		case AppConstants.DEVELOPMENT_ENV:
			return AppConstants.API_DEVELOPMENT_URL;
		case AppConstants.TESTING_ENV:
			return AppConstants.API_TEST_URL;
		default:
			return AppConstants.API_BASE_URL;
	}
};
