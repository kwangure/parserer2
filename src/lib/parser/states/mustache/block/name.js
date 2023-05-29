import { h } from 'hine';

export function createNameState() {
	return h.atomic({
		entry: [{
			actions: [
				'initializeBlock',
				'initializeBlockStatement',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'raw',
					condition: 'isWhiteSpace',
				},
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
