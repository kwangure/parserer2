import { h } from 'hine';

export function createBeforeState() {
	return h.atomic({
		on: {
			CHARACTER: [
				{
					transitionTo: 'raw',
				},
			],
		},
	});
}
