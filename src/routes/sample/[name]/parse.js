import { svelte } from '@kwangure/strawberry/code';

/**
 * @param {ReturnType<import('$lib/parser').createParser>} parser
 * @param {string} source
 */
export function eatCharacter(parser, source) {
	const { length } = source;
	const { index } = parser.context;
	if (index < length) {
		parser.dispatch('CHARACTER', source[index]);
	} else if (index === length) {
		parser.dispatch('EOF');
	}
}

/**
* @param {string} text
* @param {{ from: number; to: number; }} options
*/
export function highlightParsed(text, options) {
	const { from, to } = options;
	const coloredSegments = svelte(text, { from, to })
		.map((segment) => ({ ...segment, parsed: true }));
	coloredSegments.push({
		color: '',
		parsed: false,
		segment: text.slice(to),
	});
	return coloredSegments;
}
