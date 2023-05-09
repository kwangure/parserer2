<script>
	import '@kwangure/strawberry/css/code.css';
	import { eatCharacter, highlightParsed } from './parse.js';
	import { createParser } from '$lib/parser';
	import { stateEventNames } from 'hine';

	export let data;

	const parser = createParser();

	$: stateEvents = stateEventNames($parser);
</script>

<div>
	{data.sample.name}
</div>
<div>
	State: {$parser.state?.name}
</div>
<div>
	Index: {$parser.context.index}
</div>

<div class="flex gap-2">
	{#if stateEvents.includes('INIT')}
		<button on:click={() => parser.dispatch('INIT')}>
			Start Parsing
		</button>
	{/if}
	{#if stateEvents.includes('CHARACTER')}
		<button on:click={() => eatCharacter(parser, data.sample.content)}>
			Parse Character
		</button>
	{/if}
	{#if stateEvents.includes('RESET')}
		<button on:click={() => parser.dispatch('RESET')}>
			Reset
		</button>
	{/if}
</div>
<code>
	{#each highlightParsed(data.sample.content, {
		from: 0,
		to: $parser.context.index,
	}) as { segment, color, parsed }}
		{#if color}
			<span class:parsed style='color: var(--br-code-token-{color}-color);'>{segment}</span>
		{:else}
			<span class:parsed>{segment}</span>
		{/if}
	{/each}
</code>

<style>
	.parsed {
		background-color: hsl(144deg 55% 49% / 30%);
	}
</style>