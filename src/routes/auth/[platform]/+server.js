import { AUTH_REDIRECT_URI, SPOTIFY_AUTH_STATE_KEY, SPOTIFY_CLIENT_ID } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import qs from 'qs';

/** @type {import('./$types').RequestHandler} */
export function GET({ params, cookies }) {
	const { platform } = params;

	if (platform === 'spotify') {
		const state = crypto.randomUUID();
		cookies.set(SPOTIFY_AUTH_STATE_KEY, state);

		const location = `https://accounts.spotify.com/authorize?${qs.stringify({
			response_type: 'code',
			client_id: SPOTIFY_CLIENT_ID,
			scope: 'user-read-private user-top-read',
			redirect_uri: AUTH_REDIRECT_URI,
			state: state,
		})}`;
		throw redirect(307, location);
	} else {
		return new Response(String('Unsupported platform'));
	}
}
