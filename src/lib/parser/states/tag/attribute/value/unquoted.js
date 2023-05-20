import { h } from 'hine';

export function createUnquotedState() {
	return h.atomic({
		entry: [{
			actions: [
				'initialize',
				'addChar',
			],
		}],
		exit: [{
			actions: [
				'finalizeUnquotedValue',
				'finalizeAttribute',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'done',
					condition: 'isForwardSlash',
				},
				{
					transitionTo: 'done',
					condition: 'isWhiteSpace',
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
