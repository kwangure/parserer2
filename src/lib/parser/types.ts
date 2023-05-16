import type { PElement, PFragment, PText } from './nodes.js';
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

export interface PElementJSON {
    type: "Element";
    start: number;
    end: number;
	name: string;
    children: ReturnType<PTemplateNode['toJSON']>[];
};

export interface PFragmentJSON {
    type: "Fragment";
    start: number;
    end: number;
    children: ReturnType<PTemplateNode['toJSON']>[];
};

export type PTemplateNode = PElement
	| PFragment
	| PText;

export {};