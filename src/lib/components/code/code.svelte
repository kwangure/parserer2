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
			{#if color}
				<span style='color: var(--br-code-token-{color}-color);'>{segment}</span>
			{:else}
				{segment}
			{/if}
		{/each}
	{:else}
		{code}
	{/if}
</code>
