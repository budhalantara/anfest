import { ACCESS_TOKEN_COOKIE_KEY } from '$env/static/private';
import authToken from '$lib/server/utils/authToken';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const accessToken = event.cookies.get(ACCESS_TOKEN_COOKIE_KEY);

	if (!accessToken) {
		// @ts-ignore
		event.locals.isLoggedIn = false;
	} else {
		try {
			const { sub: userId } = authToken.validate(accessToken);
			// @ts-ignore
			event.locals.isLoggedIn = true;
			// @ts-ignore
			event.locals.userId = userId;
		} catch {
			// @ts-ignore
			event.locals.isLoggedIn = false;
		}
	}

	return resolve(event);
}
