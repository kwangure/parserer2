import { h } from 'hine';

export function createEqualsState() {
	return h.atomic({
		on: {
			CHARACTER: [
				{
					transitionTo: 'before',
					condition: 'isWhiteSpace',
				},
				{
					transitionTo: 'done',
					condition: 'isForwardSlash',
					actions: ['finalizeAttribute'],
				},
				{
					transitionTo: 'done',
					condition: 'isTagClose',
					actions: ['finalizeAttribute'],
				},
			],
		},
	});
}
