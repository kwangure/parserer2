import type { PFragment, PText } from './nodes.js';
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

export interface PStackConfig {

};

export type PTemplateNode = PFragment
	| PText;

export {};