/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals }) {
	return {
		// @ts-ignore
		isLoggedIn: locals.isLoggedIn,
	};
}
