<script>
	import { goto } from '$app/navigation';
	import { isLoggedIn } from '$lib/stores/auth';

	export let data;

	isLoggedIn.set(data.isLoggedIn);

	function login() {
		goto('/auth/spotify');
	}

	function logout() {
		goto('/auth/logout');
	}
</script>

{#if !$isLoggedIn}
	<button
		class="bg-green-500 hover:bg-green-600 py-2 px-4 rounded text-white font-semibold cursor-pointer"
		on:click={login}
	>
		Sign in with Spotify
	</button>
{:else}
	<h1>Logged In</h1>
	<button
		class="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white font-semibold cursor-pointer"
		on:click={logout}
	>
		Sign out
	</button>
{/if}
