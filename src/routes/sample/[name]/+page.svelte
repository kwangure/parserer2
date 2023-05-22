<script>
	import '@kwangure/strawberry/css/code.css';
	import { activePath, stateEventNames } from 'hine';
	import { beforeNavigate } from '$app/navigation';
	import { Code } from '$lib/components/code';
	import { createParser } from '$lib/parser';
	import { parse } from 'svelte/compiler';
	import { Player } from '$lib/components';
	import { toSvelteAST } from '$lib/parser/parse.js';

	export let data;

	const parser = createParser();

	/** @type {'parserer' | 'stack' | 'svelte'} */
	let shownPanel = 'stack';

	$: stateEvents = stateEventNames($parser);
	$: astJSON = JSON.stringify(toSvelteAST($parser), null, 4);
	$: stackJSON = JSON.stringify($parser.context.stack, null, 4);

	beforeNavigate(() => {
		parser.dispatch('RESET');
	});

	/**
	 * @param {string} code
	 */
	function svelte(code) {
		try {
			return JSON.stringify(parse(code), null, 4);
		} catch (error) {
			console.error(error);
			return String(error);
		}
	}
</script>

<div class="">
	State Events: {stateEvents}
</div>
<div class="">
	Active Path: {activePath($parser)}
</div>
<div class="grid grid-cols-2 gap-2">
	<Player code={data.sample.content} {parser}/>
	<div class="right">
		<div>
			<button class:br-button-primary={shownPanel === 'stack'} on:click={() => shownPanel = 'stack'}>
				Show Stack
			</button>
			<button class:br-button-primary={shownPanel === 'parserer'} on:click={() => shownPanel = 'parserer'}>
				Show Parserer AST
			</button>
			<button class:br-button-primary={shownPanel === 'svelte'} on:click={() => shownPanel = 'svelte'}>
				Show Svelte AST
			</button>
		</div>
		{#if shownPanel === 'stack'}
			<Code language='json' code={stackJSON}/>
		{:else if shownPanel === 'parserer'}
			<Code language='json' code={astJSON}/>
		{:else if shownPanel === 'svelte'}
			<Code language='json' code={svelte(data.sample.content)}/>
		{/if}
	</div>
</div>

<style>

</style>