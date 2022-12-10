import { writable } from 'svelte/store';

const isLoggedIn = writable(false);

export { isLoggedIn };
