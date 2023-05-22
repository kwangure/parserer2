import { h } from 'hine';

export function createUnquotedState() {
	return h.atomic({
		entry: [{
			actions: [
				'initializeUnquotedValue',
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
				actions: ['reset'],
			}],
		},
	});
}
