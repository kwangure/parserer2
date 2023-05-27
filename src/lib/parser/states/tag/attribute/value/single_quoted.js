import { h } from 'hine';

export function createSingleQuotedState() {
	return h.atomic({
		entry: [{
			actions: ['initializeTextValue'],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isSingleQuote',
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
