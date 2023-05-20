import { createBeforeState } from './before.js';
import { createTextState } from './text.js';
import { h } from 'hine';

export function createDoubleQuotedState() {
	return h.compound({
		conditions: {
			isDone: h.condition({
				run() {
					return Boolean(this.ownerState?.matches('doubleQuoted.done'));
				},
			}),
		},
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isDone',
				},
			],
		},
		states: {
			before: createBeforeState(),
			text: createTextState(),
			done: h.atomic(),
		},
	});
}
