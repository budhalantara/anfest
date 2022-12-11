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

		/**
		 * @param {Object} params
		 * @param {string} [params.type]
		 * @param {number} [params.limit]
		 * @param {number} [params.offset]
		 * @param {string|null|undefined} [params.time_range]
		 *
		 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
		 */
		async getUserTopItems({ type, limit, offset, time_range }) {
			return instance
				.get(`/v1/me/top/${type}`, {
					params: {
						limit,
						offset,
						time_range,
					},
				})
				.then((res) => res.data);
		},
	};
}
