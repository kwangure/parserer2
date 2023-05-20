import { h } from 'hine';

export function createDoubleQuotedState() {
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
					condition: 'isDoubleQuote',
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
