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
 * @param {ReturnType<import('$lib/parser').createParser>} parser
 * @param {string} source
 */
export function parseFile(parser, source) {
	parser.dispatch('INIT');
	for (let i = 0; i < source.length; i++) {
		const char = source[i];
		parser.dispatch('CHARACTER', char);
	}
	parser.dispatch('EOF');
}

/**
 * @param {import('./types').ParserWithContext} parser
 */
export function toSvelteAST(parser) {
	return {
		html: parser.context.html.toJSON(),
	};
}

/**
* @param {string} text
* @param {number} index
*/
export function highlightParsed(text, index) {
	const previous = svelte(text, { from: 0, to: index });
	const current = svelte(text, { from: index, to: index + 1 });
	const next = svelte(text, { from: index + 1 });
	return [
		...previous.map((segments) => ({
			eof: false,
			...segments,
			status: /** @type {const} */('previous'),
		})),
		...current.map((segments) => ({
			eof: false,
			...segments,
			status: /** @type {const} */('current'),
		})),
		...next.map((segments) => ({
			eof: false,
			...segments,
			status: /** @type {const} */('next'),
		})),
		{
			eof: true,
			segment: ' ',
			color: '',
			status: index === text.length
				? /** @type {const} */('current')
				: /** @type {const} */('next'),
		},
	];
}
