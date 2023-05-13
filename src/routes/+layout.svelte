<script>
	import './layout.css';
	import '@kwangure/strawberry/css/global.css';
	import '@kwangure/strawberry/css/reset.css';
	import '@kwangure/strawberry/css/button.css';
	import '@kwangure/strawberry/css/focusable.css';

	import { Link, Section } from '$lib/components/sidebar';

	export let data;
</script>

<main class='grid grid-cols-[240px_minmax(500px,_1fr)]'>
	<div class="br-sidebar">
		<Link href='/'>
			Getting started
		</Link>
		<Section title='test samples'>
			{#each data.testSamples as sample}
				<Link href='/sample/{sample}'>
					{sample}
				</Link>
			{/each}
		</Section>
	</div>
	<div>
		<slot/>
	</div>
</main>
