import SecureStorage from 'secure-web-storage'
import { AES, SHA256, enc } from 'crypto-js'

const SECRET_KEY = process.env.REACT_APP_SECURE_STORAGE_KEY || 'default_secret_key'

export const secureStorage = new SecureStorage(localStorage, {
	hash: function (key: string) {
		return SHA256(key + SECRET_KEY).toString()
	},
	encrypt: function (data: string) {
		return AES.encrypt(data, SECRET_KEY).toString()
	},
	decrypt: function (data: string) {
		return AES.decrypt(data, SECRET_KEY).toString(enc.Utf8)
	},
})
