import { h } from 'hine';

export function createNameState() {
	return h.atomic({
		entry: [{
			actions: [
				'initializeElement',
				'addElementName',
			],
		}],
		on: {
			CHARACTER: [
				{
					transitionTo: 'attribute',
					condition: 'isWhiteSpace',
				},
				{
					transitionTo: 'done',
					condition: 'isTagClose',
				},
				{
					transitionTo: 'selfClose',
					condition: 'isForwardSlash',
				},
				{
					actions: ['addElementName'],
				},
			],
		},
	});
}
