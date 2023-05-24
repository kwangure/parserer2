<script>
	import { css, javascript, json, svelte } from '@kwangure/strawberry/code';

	/** @type {string} */
	export let code;
	/** @type {'css' | 'javascript' | 'json' | 'svelte'} */
	export let language;
	export let inline = false;

	const SUPPORTED_LANGUAGES = {
		css,
		javascript,
		json,
		svelte,
	};

	$: highlighter = SUPPORTED_LANGUAGES[language];
</script>

<code class:br-code-inline={inline} class='px-4 py-3'>
	{#if highlighter}
		{#each highlighter(code) as { segment, color }}
			<span class='br-token-{color}'>{segment}</span>
		{/each}
	{:else}
		{code}
	{/if}
</code>
