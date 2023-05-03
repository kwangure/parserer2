<script>
	import { css, javascript, svelte } from '@kwangure/strawberry/code';

	/** @type {string} */
	export let code;
	/** @type {'css' | 'javascript' | 'svelte'} */
	export let language;
	export let inline = false;

	const SUPPORTED_LANGUAGES = {
		css,
		javascript,
		svelte,
	};

	$: highlighter = SUPPORTED_LANGUAGES[language];
</script>

<code class:br-code-inline={inline}>
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
