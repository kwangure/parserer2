<script>
	import { Code } from '$lib/components/code';
	export let data;
</script>

{data.sample.name}
{#await data.sample.content then content}
	<Code language='svelte' code={content}/>
{/await}

<style>

</style>