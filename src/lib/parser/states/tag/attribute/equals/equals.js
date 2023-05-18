import { createBeforeState } from './before.js';
import { h } from 'hine';

export function createEqualsState() {
	return h.compound({
		states: {
			before: createBeforeState(),
			done: h.atomic(),
		},
	});
}
