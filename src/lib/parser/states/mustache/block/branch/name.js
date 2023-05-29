import { h } from 'hine';

export function createNameState() {
	return h.atomic({
		entry: [{
			actions: [
				'initializeBlockStatement',
				'addBlockStatementName',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isMustacheClose',
					actions: ['addBlockStatementEnd'],
				},
				{
					actions: ['addBlockStatementName'],
				},
				// TODO: Otherwise invalid
			],
		},
	});
}
