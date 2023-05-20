import { h } from 'hine';

export function createTextState() {
	return h.atomic({
		entry: [{
			actions: [
				'initialize',
				'addChar',
			],
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
