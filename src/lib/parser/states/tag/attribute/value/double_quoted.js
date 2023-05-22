import { h } from 'hine';

export function createDoubleQuotedState() {
	return h.atomic({
		entry: [{
			actions: ['initializeQuotedValue'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isDoubleQuote',
					actions: [
						'finalizeQuotedValue',
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
