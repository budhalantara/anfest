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
			// @ts-ignore
			const { sub: userId, name: userName } = authToken.validate(accessToken);
			// @ts-ignore
			event.locals.isLoggedIn = true;
			// @ts-ignore
			event.locals.userId = userId;
			// @ts-ignore
			event.locals.userName = userName;
		} catch {
			// @ts-ignore
			event.locals.isLoggedIn = false;
		}
	}

	return resolve(event);
}
