import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	// @ts-ignore
	const { isLoggedIn } = locals;

	if (!isLoggedIn) {
		return;
	}

	const time_range = url.searchParams.get('time_range');
	if (!time_range) {
		throw redirect(301, '/?time_range=medium_term');
	}
}
