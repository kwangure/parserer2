export class PFragment {
	#type = 'Fragment';
	end = 0;
	start = 0;
	clear() {
		this.end = 0;
		this.start = 0;
	}
	toJSON() {
		return {
			start: this.start,
			end: this.end,
			type: this.type,
		};
	}
	get type() {
		return this.#type;
	}
}

export class PText {
	#type = 'Text';
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
			start: this.start,
			end: this.end,
			type: this.type,
		};
	}
	get type() {
		return this.#type;
	}
}
