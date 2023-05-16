<script>
	import '@kwangure/strawberry/css/code.css';
	import { activePath, stateEventNames } from 'hine';
	import { eatCharacter, highlightParsed } from '$lib/parser/parse.js';
	import { Code } from '$lib/components/code';
	import { createParser } from '$lib/parser';

	export let data;

	const parser = createParser();

	/** @type {'AST' | 'stack'} */
	let shownPanel = 'stack';

	$: stateEvents = stateEventNames($parser);
	$: astJSON = JSON.stringify($parser.context.html, null, 4);
	$: stackJSON = JSON.stringify($parser.context.stack, null, 4);
</script>

<div class="">
	State Events: {stateEvents}
</div>
<div class="">
	Active Path: {activePath($parser)}
</div>
<div class="grid grid-cols-2 gap-2">
	<div>
		<div class="flex gap-2">
			{#if stateEvents.includes('INIT')}
				<button on:click={() => parser.dispatch('INIT')}>
					Start Parsing
				</button>
			{/if}
			{#if parser.state?.name !== 'eof' && stateEvents.includes('CHARACTER')}
				<button on:click={() => eatCharacter(parser, data.sample.content)}>
					Consume Character
				</button>
			{/if}
			{#if stateEvents.includes('RESET')}
				<button on:click={() => parser.dispatch('RESET')}>
					Reset to Start
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
	</div>
	<div class="right">
		<div>
			<button class:br-button-primary={shownPanel === 'stack'} on:click={() => shownPanel = 'stack'}>
				Show Stack
			</button>
			<button class:br-button-primary={shownPanel === 'AST'} on:click={() => shownPanel = 'AST'}>
				Show AST
			</button>
		</div>
		{#if shownPanel === 'stack'}
			<Code language='json' code={stackJSON}/>
		{:else if shownPanel === 'AST'}
			<Code language='json' code={astJSON}/>
		{/if}
	</div>
</div>

<style>
	.parsed {
		background-color: hsl(144deg 55% 49% / 30%);
	}
</style>