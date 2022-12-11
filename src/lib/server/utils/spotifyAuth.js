import { AUTH_REDIRECT_URI, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import axios from 'axios';
import dayjs from 'dayjs';
import qs from 'qs';
import { decrypt, encrypt } from './encryption';
import pgPool from './pg';

const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	auth: {
		username: SPOTIFY_CLIENT_ID,
		password: SPOTIFY_CLIENT_SECRET,
	},
};

/**
 * @param {Object} params
 * @param {string} [params.code]
 * @param {string} [params.refreshToken]
 *
 * @typedef {Object} OAuthToken
 * @property {string} access_token
 * @property {number} token_type
 * @property {string} expires_in
 * @property {string} refresh_token
 * @property {string} scope
 * @property {Date} created_at
 * @return {Promise<OAuthToken>}
 */
async function getOauthToken({ code, refreshToken }) {
	let data;
	if (code) {
		data = {
			code,
			grant_type: 'authorization_code',
			redirect_uri: AUTH_REDIRECT_URI,
		};
	} else if (refreshToken) {
		data = {
			refresh_token: refreshToken,
			grant_type: 'refresh_token',
		};
	}

	const res = await axios.post(
		'https://accounts.spotify.com/api/token',
		qs.stringify(data),
		config
	);

	return { ...res.data, created_at: new Date() };
}

/**
 * @param {number|string} userId
 * @param {string} encryptedOauthData
 *
 * @return {Promise<OAuthToken>}
 */
async function handleRefreshToken(userId, encryptedOauthData) {
	let oauthData = JSON.parse(decrypt(encryptedOauthData));

	if (dayjs().diff(oauthData.created_at, 'seconds') >= oauthData.expires_in - 5) {
		const newOauthData = await getOauthToken({ refreshToken: oauthData.refresh_token });

		oauthData = {
			...oauthData,
			...newOauthData,
		};

		await pgPool.query(
			`UPDATE users
			SET spotify_oauth_data = $1
			WHERE id = $2`,
			[encrypt(JSON.stringify(oauthData)), userId]
		);
	}

	return oauthData;
}

export default { getOauthToken, handleRefreshToken };
