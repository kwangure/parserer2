import fs from 'node:fs';
import { TEST_SAMPLES_PATH } from '$tests';

export function load({ params }) {
	const { name } = params;
	return {
		sample: {
			name,
			content: fs.readFileSync(`${TEST_SAMPLES_PATH}/${name}/input.svelte`, 'utf-8'),
		},
	};
}
