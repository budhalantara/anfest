import { AUTH_REDIRECT_URI, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import axios from 'axios';
import qs from 'qs';

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
 * @return {Promise<OAuthToken>}
 */
async function getOauthToken({ code, refreshToken }) {
	let grant_type = '';
	if (code) {
		grant_type = 'authorization_code';
	} else if (refreshToken) {
		grant_type = 'refresh_token';
	}

	const res = await axios.post(
		'https://accounts.spotify.com/api/token',
		qs.stringify({
			code,
			refresh_token: refreshToken,
			grant_type,
			redirect_uri: AUTH_REDIRECT_URI,
		}),
		config
	);

	return res.data;
}

export default { getOauthToken };
