import { h } from 'hine';

export function createFragmentState() {
	return h.atomic({
		on: {
			CHARACTER: [
				{
					transitionTo: 'tag',
					condition: 'isTagOpen',
				},
				{
					transitionTo: 'text',
				},
			],
			EOF: [{
				transitionTo: 'eof',
			}],
		},
	});
}
