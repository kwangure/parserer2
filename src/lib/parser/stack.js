/** @typedef {import('./types').PTemplateNode} PTemplateNode */

export class PStack {
	/** @type {PTemplateNode[]} */
	#value = [];
	clear() {
		this.#value.length = 0;
	}
	/** @param {PTemplateNode} value */
	push(value) {
		return this.#value.push(value);
	}
	get size() {
		return this.#value.length;
	}
}
