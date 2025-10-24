import { AppConstants } from '../enums/appConstants';
import { Environment } from './interface/types';
import crypto from 'crypto';

const key = Buffer.from(process.env.JWT_ENCRYPTION_KEY!, 'hex'); // 32 bytes for AES-256-GCM

/**
 * Get the environment based on the host.
 *
 * @param {string} host - The host name of the server. Usually request headers ->> req.headers.host.
 * @returns {Environment} - The environment object. use isLocal isDev etc so you can check the environment
 */
export const getEnvironment = (host: string): Environment => {
  const environment = {
    isLocal: false,
    isDev: false,
    isTest: false,
    isProd: false,
    env: AppConstants.TESTING_ENV, // Default
  };

  if (host.includes('local')) {
    return { ...environment, isLocal: true, env: AppConstants.TESTING_ENV };
  } else if (host.includes('dev')) {
    return { ...environment, isDev: true, env: AppConstants.DEVELOPMENT_ENV };
  } else if (host.includes('test')) {
    return { ...environment, isTest: true, env: AppConstants.STAGING_ENV };
  } else if (host.includes('yourapp.com')) {
    return { ...environment, isProd: true, env: AppConstants.PRODUCTION_ENV };
  }

  // Fallback environment
  return environment;
};

/**
 * Get the base URL for the API based on the environment.
 *
 * @param {string} host - The host name of the server. Usually request headers ->> req.headers.host.
 * @returns {string} - The base URL for the API.
 */
export const getApiBaseUrl = (host: string): string => {
  const { env } = getEnvironment(host); // Use the env property from getEnvironment

  const apiUrls: Record<string, string> = {
    [AppConstants.PRODUCTION_ENV]: AppConstants.API_PROD_URL,
    [AppConstants.STAGING_ENV]: AppConstants.API_STAGING_URL,
    [AppConstants.DEVELOPMENT_ENV]: AppConstants.API_DEVELOPMENT_URL,
    [AppConstants.TESTING_ENV]: AppConstants.API_TEST_URL,
  };

  // Return the corresponding URL or the base URL as fallback
  return apiUrls[env] || AppConstants.API_BASE_URL;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters (except space and hyphen)
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
};

export function encryptJWT(jwt: string): string {
  const iv = crypto.randomBytes(12); // 12 bytes for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(jwt, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decryptJWT(encrypted: string): string {
  const data = Buffer.from(encrypted, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(12, 28);
  const encryptedJWT = data.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encryptedJWT, undefined, 'utf8') + decipher.final('utf8');
}
