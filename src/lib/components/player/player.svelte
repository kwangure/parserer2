<script>
	import { eatUntil, highlightParsed, parseFile } from '$lib/parser/parse.js';
	import { mdiPlay, mdiRestore, mdiStepBackward, mdiStepForward } from '@mdi/js';
	import { Icon } from '$lib/components';
	import { stateEventNames } from 'hine';

	/** @type {string} */
	export let code;
	/** @type {import('$lib/parser/types').WritableParserWithContext} */
	export let parser;

	$: ({ index } = $parser.context);
	$: segments = highlightParsed(code, index);
	$: stateEvents = stateEventNames($parser);

	function stepForward() {
		if (parser.context.index < code.length) {
			eatUntil(parser, code, parser.context.index + 1);
		} else {
			parser.dispatch('EOF');
		}
	}

	function stepBackward() {
		if (!parser.context.index) return;
		const parseUntil = parser.context.index - 1;
		parser.dispatch('RESET');
		eatUntil(parser, code, parseUntil);
	}
</script>

<div class="rounded">
	<code class="px-4 py-3">
		{#each segments as { color, eof, segment, status }}
			{#if color}
				<span class={status} class:eof style='color: var(--br-code-token-{color}-color);'>{segment}</span>
			{:else}
				<span class={status} class:eof>{segment}</span>
			{/if}
		{/each}
	</code>
	<div>
		<button on:click={stepBackward}>
			<Icon path={mdiStepBackward}/>
		</button>
		{#if stateEvents.includes('CHARACTER')}
			<button on:click={() => parseFile(parser, code)}>
				<Icon path={mdiPlay}/>
			</button>
		{/if}
		<button on:click={stepForward}>
			<Icon path={mdiStepForward}/>
		</button>
		{#if stateEvents.includes('RESET')}
			<button on:click={() => parser.dispatch('RESET')}>
				<Icon path={mdiRestore}/>
			</button>
		{/if}
	</div>
</div>

<style>
	code {
		background-color: #000;
	}
	button {
		border: 1px solid transparent;
		background-color: #333;
	}
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