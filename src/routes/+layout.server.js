import { ACCESS_TOKEN_COOKIE_KEY } from '$env/static/private';
import authToken from '$lib/server/utils/authToken';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ cookies }) {
	const accessToken = cookies.get(ACCESS_TOKEN_COOKIE_KEY);

	let isLoggedIn = false;

	if (!accessToken) {
		isLoggedIn = false;
	} else {
		try {
			authToken.validate(accessToken);
			isLoggedIn = true;
		} catch {
			isLoggedIn = false;
		}
	}

	return {
		isLoggedIn,
	};
}
