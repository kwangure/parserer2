import type { PAttribute, PElement, PFragment, PText } from './nodes.js';
import type { PStack } from './stack.js';

export interface ParserContext {
	index: number;
	html: PFragment;
	stack: PStack;
}

export interface PFragmentConfig {
	start: number;
	end?: number;
};

export interface PTextConfig {
	start: number;
	end?: number;
};

export interface PAttributeJSON {
    type: "Attribute";
    start: number;
    end: number;
	name: string;
    value: true | [PText];
};

export interface PElementJSON {
    type: "Element";
    start: number;
    end: number;
	name: string;
	attributes: ReturnType<PAttribute['toJSON']>[];
    children: ReturnType<PTemplateNode['toJSON']>[];
};

export interface PFragmentJSON {
    type: "Fragment";
    start: number;
    end: number;
    children: ReturnType<PTemplateNode['toJSON']>[];
};

export type PTemplateNode = PAttribute
	| PElement
	| PFragment
	| PText;

export {};