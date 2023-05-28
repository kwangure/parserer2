import { h } from 'hine';

export function createNameState() {
	return h.atomic({
		entry: [{
			actions: ['addBlockStatementName'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isMustacheClose',
				},
				{
					actions: ['addBlockStatementName'],
				},
				// TODO: Otherwise invalid
			],
		},
	});
}
