<script>
	import { goto } from '$app/navigation';
	import { isLoggedIn } from '$lib/stores/auth';
	import axios from 'axios';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import html2canvas from 'html2canvas';

	/** @type {import('./$types').PageData} */
	export let data;

	isLoggedIn.set(data.isLoggedIn);

	function login() {
		goto('/auth/spotify');
	}

	function logout() {
		goto('/auth/logout');
	}

	/**
	 * @type {HTMLElement}
	 */
	let flyer;

	function save() {
		if (!flyer) {
			return;
		}

		html2canvas(flyer, { scale: 4 }).then((canvas) => {
			const dataURL = canvas.toDataURL('image/png');
			const anchor = document.createElement('a');
			anchor.download = 'anfest.png';
			anchor.href = dataURL;
			anchor.click();
		});
	}

	/**
	 * @type {[][]}
	 */
	let sections = [];
	let popularity = 0;
	$: time_range = $page.url.searchParams.get('time_range');

	$: if (browser) {
		axios.get('/api/top_artists', { params: { time_range } }).then((res) => {
			sections = res.data.sections;
			popularity = res.data.popularity;
		});
	}
</script>

<header class="w-full h-16 border flex justify-center items-center">
	<div class="max-w-6xl w-full flex justify-center items-center">
		<div>
			<div class="cursor-pointer"><img src="/images/logo.png" alt="Logo" /></div>
		</div>
	</div>
</header>

Name : {data.userName}

<br />
<a href="/?time_range=short_term">Last 4 weeks</a> |
<a href="/?time_range=medium_term">Last 6 months</a> |
<a href="/?time_range=long_term">All-time</a>

<div class="flex flex-col md:flex-row min-h-[94vh]">
	<div
		class="flex sm:flex-1 justify-center lg:justify-end items-center mt-5 lg:mt-0 mx-5 sm:mx-0 lg:w-[55vw] lg:p-10 md:p-10"
	>
		<div class="w-[40rem] h-[40rem] bg-black text-white font-[Poppins] p-6" bind:this={flyer}>
			<h1 class="text-center text-3xl font-bold italic">ANFEST</h1>
			<h3 class="text-center py-4">presented by anfest</h3>
			{#each sections as artists}
				<div class="my-6 text-center">
					<span class="text-5xl leading-[0.8rem] m-0" style="font-family: Passion One">
						{artists.shift()?.toUpperCase()}
					</span>

					<div class="font-[Poppins] font-bold text-2xl leading-6">
						{#each artists.splice(0, 3) as artist, i}
							<span>{artist?.toUpperCase()}</span>
							{#if i < 2}
								<span class="text-white">• </span>
							{/if}
						{/each}
					</div>

					<div class="font-[Poppins] font-bold text-lg leading-5">
						{#each artists as artist, i}
							<span>{artist?.toUpperCase()}</span>
							{#if i < 7}
								<span class="text-white">• </span>
							{/if}
						{/each}
					</div>
					<!-- {#each section as artist}
						
					{/each} -->
				</div>
			{/each}
		</div>
		<!-- <p>Popularity: {popularity}</p> -->
	</div>
	<div
		class="flex sm:flex-1 flex-col items-center justify-center p-5 sm:p-10 md:p-5 lg:p-10 text-center mb-10 mt-2 sm:mt-0"
	>
		<div
			class="flex sm:flex-1 flex-col items-center justify-center p-5 sm:p-10 md:p-5 lg:p-10 text-center mb-10 mt-2 sm:mt-0"
		>
			<div class="lg:max-w-[600px] md:mr-7">
				<div>
					<h1 class="font-bold text-4xl">Create a festival lineup from your top artists.</h1>
					<p>Sign in to get started.</p>
				</div>
				<div class="flex sm:flex-row flex-col mt-6 sm:justify-center">
					{#if !$isLoggedIn}
						<button
							class="bg-green-500 hover:bg-green-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3"
							on:click={login}
						>
							Sign in with Spotify
						</button>
						<!-- <button
							class="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3"
							on:click={logout}
						>
							Sign in with Apple Music
							<p class="text-xs ml-2 font-regular opacity-80">BETA</p>
						</button>
						<button
							class="bg-gray-500 hover:bg-gray-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3"
							on:click={logout}
						>
							Sign in with Last.fm
						</button> -->
					{:else}
						<button
							class="bg-black hover:bg-slate-800 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3"
							on:click={save}
						>
							Save
						</button>
						<button
							class="bg-red-500 hover:bg-red-600 py-2 px-4 rounded text-white font-semibold cursor-pointer sm:mr-3"
							on:click={logout}
						>
							Sign out
						</button>
					{/if}
				</div>
				<p class="text-xs mt-4">
					Read our <a href="/privacy" class="text-blue-500 underline cursor-pointer"
						>Privacy Policy</a
					>.
				</p>
			</div>
		</div>
	</div>
</div>

<footer class="w-full h-[120px] bg-slate-100 p-5 text-center text-slate-800">
	<div class="flex justify-center items-center">
		<img src="/images/Spotify_Logo.png" alt="Spotify" class="h-[2.1rem]" />
	</div>
	<p class="mt-2">
		Made with ❤️ by <a href="https://discord.gg/9pVGSF5Ueb" class="text-blue-500 underline">
			Heavenly Castle
		</a>
	</p>
</footer>
