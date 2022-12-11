import pgPool from '$lib/server/utils/pg';
import { createSpotifyApiClient } from '$lib/server/utils/spotifyApi';
import spotifyAuth from '$lib/server/utils/spotifyAuth';
import { error, json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
	// @ts-ignore
	const { userId } = locals;

	if (!userId) {
		throw error(401, { message: 'Unauthorized' });
	}

	const {
		rows: [user],
	} = await pgPool.query(
		`SELECT spotify_oauth_data
    FROM users
    WHERE id = $1`,
		[userId]
	);

	const { access_token } = await spotifyAuth.handleRefreshToken(userId, user.spotify_oauth_data);

	const spotifyApi = createSpotifyApiClient(access_token);

	const time_range = url.searchParams.get('time_range');
	const resGetTopArtists = await spotifyApi.getUserTopItems({
		type: 'artists',
		time_range,
		limit: 50,
	});

	const topArtists = resGetTopArtists.items;

	const result = {
		sections: [],
		popularity: 0,
	};

	let totalArtists = 0;
	for (let i = 0; i < 3; i++) {
		const artists = [];
		for (let j = 0; j < 12; j++) {
			const artist = topArtists[j * 3 + i];
			artists.push(artist.name);
			result.popularity += artist.popularity;
			totalArtists++;
		}

		// @ts-ignore
		result.sections.push(artists);
	}

	result.popularity /= totalArtists;

	return json(result);
}
