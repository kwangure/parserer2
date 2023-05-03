import fs from 'node:fs/promises';
import { TEST_SAMPLES_PATH } from '$tests';

export function load({ params }) {
	const { name } = params;
	return {
		sample: {
			name,
			content: fs.readFile(`${TEST_SAMPLES_PATH}/${name}/input.svelte`, 'utf-8'),
		},
	};
}
