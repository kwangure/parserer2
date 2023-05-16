export class PElement {
	/** @type {import("./types").PTemplateNode[]} */
	#children = [];
	#type = /** @type {const} */('Element');
	end = 0;
	name = '';
	start = 0;
	/**
	 * @param {PElement | PText} node
	 */
	append(node) {
		switch (node.type) {
			case 'Element': {
				this.#children.push(node);
				break;
			}
			case 'Text': {
				const lastChild = this.#children.at(-1);
				if (lastChild?.type === 'Text') {
					lastChild.end = node.end;
					lastChild.raw += node.raw;
				} else {
					this.#children.push(node);
				}
				break;
			}
			default:
				throw Error(`Element nodes do not take '${node}' as a child.`);
		}
	}
	clear() {
		this.end = 0;
		this.name = '';
		this.start = 0;
		this.#children.length = 0;
	}
	/** @returns {import("./types").PElementJSON} */
	toJSON() {
		return {
			type: this.type,
			start: this.start,
			end: this.end,
			name: this.name,
			children: this.#children?.map((child) => child.toJSON()),
		};
	}
	get type() {
		return this.#type;
	}
}

export class PFragment {
	/** @type {import("./types").PTemplateNode[]} */
	#children = [];
	#type = /** @type {const} */('Fragment');
	end = 0;
	start = 0;
	/**
	 * @param {PElement | PText} node
	 */
	append(node) {
		switch (node.type) {
			case 'Element':
				this.#children.push(node);
				break;
			case 'Text': {
				const lastChild = this.#children.at(-1);
				if (lastChild?.type === 'Text') {
					lastChild.end = node.end;
					lastChild.raw += node.raw;
				} else {
					this.#children.push(node);
				}
				break;
			}
			default:
				throw Error(`Fragment nodes do not take '${node}' as a child.`);
		}
	}
	clear() {
		this.end = 0;
		this.start = 0;
		this.#children.length = 0;
	}
	/** @returns {import("./types").PFragmentJSON} */
	toJSON() {
		return {
			type: this.type,
			start: this.start,
			end: this.end,
			children: this.#children?.map((child) => child.toJSON()),
		};
	}
	get type() {
		return this.#type;
	}
}

export class PText {
	#type = /** @type {const} */('Text');
	end = 0;
	raw = '';
	start = 0;
	clear() {
		this.end = 0;
		this.raw = '';
		this.start = 0;
	}
	toJSON() {
		return {
			type: this.type,
			start: this.start,
			end: this.end,
			raw: this.raw,
		};
	}
	get type() {
		return this.#type;
	}
}
