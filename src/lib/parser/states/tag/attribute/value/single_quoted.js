import { h } from 'hine';

export function createSingleQuotedState() {
	return h.atomic({
		entry: [{
			actions: ['initializeQuotedValue'],
		}],
		exit: [{
			actions: [
				'finalizeQuotedValue',
				'finalizeAttribute',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isSingleQuote',
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
