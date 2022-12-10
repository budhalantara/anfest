import { ACCESS_TOKEN_COOKIE_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	cookies.delete(ACCESS_TOKEN_COOKIE_KEY, { path: '/' });

	throw redirect(307, '/');
}
