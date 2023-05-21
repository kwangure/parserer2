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
	$: isEOF = $parser.context.index === data.sample.content.length;
	$: segments = highlightParsed(data.sample.content, $parser.context.index);
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
					{#if isEOF}
						Consume EOF
					{:else}
						Consume Character
					{/if}
				</button>
			{/if}
			{#if stateEvents.includes('RESET')}
				<button on:click={() => parser.dispatch('RESET')}>
					Reset to Start
				</button>
			{/if}
		</div>
		{#if stateEvents.includes('INIT')}
			<Code code={data.sample.content} language='svelte'/>
		{:else}
			<code class="px-4 py-3">
				{#each segments as { color, eof, segment, status }}
					{#if color}
						<span class={status} class:eof style='color: var(--br-code-token-{color}-color);'>{segment}</span>
					{:else}
						<span class={status} class:eof>{segment}</span>
					{/if}
				{/each}
			</code>
		{/if}
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
	.previous {
		background-color: hsl(144deg 55% 49% / 30%);
	}
	.current {
		color: hsl(145deg 55% 20%) !important;
		background-color: #fff;
		border-radius: 2px;
	}
	.eof.current {
		background-color: hsl(205deg 55% 49%);
	}
</style>