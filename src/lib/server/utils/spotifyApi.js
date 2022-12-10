import axios from 'axios';

/**
 * @param {string} accessToken
 */
export function createSpotifyApiClient(accessToken) {
	const instance = axios.create({
		baseURL: 'https://api.spotify.com',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return {
		async getCurrentUserProfile() {
			return instance.get('/v1/me').then((res) => res.data);
		},
	};
}
