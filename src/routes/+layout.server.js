import { ACCESS_TOKEN_COOKIE_KEY } from '$env/static/private';
import authToken from '$lib/server/utils/authToken';

/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	return {
		// @ts-ignore
		isLoggedIn: locals.isLoggedIn,
	};
}
