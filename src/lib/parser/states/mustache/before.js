import { h } from 'hine';

export function createBeforeState() {
	return h.atomic({
		on: {
			CHARACTER: [
				{
					transitionTo: 'block',
					condition: 'isHashTag',
				},
				{
					transitionTo: 'block',
					condition: 'isForwardSlash',
				},
				{
					transitionTo: 'raw',
				},
			],
		},
	});
}
