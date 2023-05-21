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
					transitionTo: 'done',
					condition: 'isTagClose',
				},
				{
					actions: ['addElementName'],
				},
				// TODO: Otherwise invalid
			],
		},
	});
}
