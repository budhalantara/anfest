import { SESSION_ENCRYPTION_KEY } from '$env/static/private';
import crypto from 'crypto';

const key = Buffer.from(SESSION_ENCRYPTION_KEY, 'base64');

/**
 * @param {string} plaintext
 */
function encrypt(plaintext) {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	const encrypted = cipher.update(plaintext);

	return Buffer.concat([iv, encrypted]).toString('base64');
}

/**
 * @param {string} encrypted
 */
function decrypt(encrypted) {
	const buffer = Buffer.from(encrypted, 'base64');
	const iv = buffer.subarray(0, 16);
	const content = buffer.subarray(16);
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

	return decipher.update(content).toString();
}

export { encrypt, decrypt };
