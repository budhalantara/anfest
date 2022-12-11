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

<header class="w-full h-16 border flex justify-center items-center">
	<div class="max-w-6xl w-full flex justify-center items-center">
		<div>
			<div class="cursor-pointer"><img src="static/images/logo.png"></div>
		</div>
	</div>
</header>

<div class="flex flex-col md:flex-row min-h-[94vh]">
	<div class="flex sm:flex-1 justify-center lg:justify-end items-center mt-5 lg:mt-0 mx-5 sm:mx-0 lg:w-[55vw] lg:p-10 md:p-10">
		<div class="w-[40rem] h-[40rem] bg-purple-500"></div>
	</div>
	<div class="flex sm:flex-1 flex-col items-center justify-center p-5 sm:p-10 md:p-5 lg:p-10 text-center mb-10 mt-2 sm:mt-0">
		<div class="flex sm:flex-1 flex-col items-center justify-center p-5 sm:p-10 md:p-5 lg:p-10 text-center mb-10 mt-2 sm:mt-0">
			<div class="lg:max-w-[600px] md:mr-7">
				<div>
					<h1 class="font-bold text-4xl">Create a festival lineup from your top artists.</h1>
					<p>Sign in to get started.</p>
				</div>
				<div class="flex sm:flex-row flex-col mt-6 sm:justify-center">
					{#if !$isLoggedIn}
						<button
							class="bg-green-500 hover:bg-green-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3" on:click={login}>
							Sign in with Spotify
						</button>
						<button class="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3" on:click={logout}>
							Sign in with Apple Music
							<p class="text-xs ml-2 font-regular opacity-80">BETA</p>
						</button>
						<button class="bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3" on:click={logout}>
							Sign in with Last.fm
						</button>
					{:else}
						<button class="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3" on:click={logout}>
							Sign out
						</button>
					{/if}
				</div>
				<p class="text-xs mt-4">Read our <a href="/privacy" class="text-blue-500 underline cursor-pointer">Privacy Policy</a>.</p>
			</div>
		</div>
	</div>
</div>


<footer class="w-full h-[120px] bg-slate-100 p-5 text-center text-slate-800">
	<div class="flex justify-center items-center">
		<img src="/images/Spotify_Logo.png" alt="Spotify" class="h-[2.1rem]">
	</div>
	<p class="mt-2">Made with ❤️ by <a href="https://discord.gg/9pVGSF5Ueb" class="text-blue-500 underline">Heavenly Castle</a></p>
</footer>
