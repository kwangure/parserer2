import { h } from 'hine';

export function createUnquotedState() {
	return h.atomic({
		entry: [{
			actions: [
				'initializeTextValue',
				'addChar',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isForwardSlash',
					actions: [
						'finalizeUnquotedValue',
						'finalizeAttribute',
					],
				},
				{
					transitionTo: 'done',
					condition: 'isWhiteSpace',
					actions: [
						'finalizeUnquotedValue',
						'finalizeAttribute',
					],
				},
				{
					actions: ['addChar'],
				},
			],
			RESET: [{
				actions: ['resetText'],
			}],
		},
	});
}
