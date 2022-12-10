import {
	JWT_EXPIRATION,
	ACCESS_TOKEN_COOKIE_KEY,
	SPOTIFY_AUTH_STATE_KEY,
} from '$env/static/private';
import authToken from '$lib/server/utils/authToken';
import { encrypt } from '$lib/server/utils/encryption';
import pgPool from '$lib/server/utils/pg';
import { createSpotifyApiClient } from '$lib/server/utils/spotifyApi';
import spotifyAuth from '$lib/server/utils/spotifyAuth';
import { redirect } from '@sveltejs/kit';
import dayjs from 'dayjs';
import ms from 'ms';
import qs from 'qs';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
	const { code, state } = Object.fromEntries(url.searchParams);
	const stateFromCookie = cookies.get(SPOTIFY_AUTH_STATE_KEY);

	if (state !== stateFromCookie) {
		throw redirect(307, '/?error=state_mismatch');
	}

	const oauthToken = await spotifyAuth.getOauthToken({ code }).catch((error) => {
		if (error.response?.data) {
			throw redirect(
				307,
				`/?${qs.stringify({
					error: error.response.data.error,
					error_description: error.response.data.error_description,
				})}`
			);
		}
		throw error;
	});

	const spotifyApi = createSpotifyApiClient(oauthToken.access_token);
	const profile = await spotifyApi.getCurrentUserProfile();

	const conn = await pgPool.connect();
	try {
		let {
			rows: [user],
		} = await conn.query(
			`SELECT
				id,
				name,
				profile_picture_url
			FROM users
			WHERE
				spotify_user_id = $1`,
			[profile.id]
		);

		if (!user) {
			const {
				rows: [newUser],
			} = await conn.query(
				`INSERT INTO users(
					name,
					spotify_user_id,
					profile_picture_url
				)
				VALUES (
					$1,
					$2,
					$3
				)
				RETURNING
					id,
					name,
					profile_picture_url`,
				[profile.display_name, profile.id, profile.images[0]?.url]
			);

			user = newUser;
		}

		if (!user) {
			throw redirect(307, '/?error=invalid_user');
		}

		const encryptedOauthData = encrypt(JSON.stringify(oauthToken));
		await conn.query(
			`UPDATE users
			SET spotify_oauth_data = $1
			WHERE id = $2`,
			[encryptedOauthData, user.id]
		);

		cookies.delete(SPOTIFY_AUTH_STATE_KEY);

		const _authToken = await authToken.generate(user);
		cookies.set(ACCESS_TOKEN_COOKIE_KEY, _authToken.access_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			expires: dayjs().add(ms(JWT_EXPIRATION), 'milliseconds').toDate(),
		});

		throw redirect(307, '/');
	} catch (error) {
		conn.release();
		throw error;
	}
}
