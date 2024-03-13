import type { NodeDef } from "node-red";

export interface ClipboardNodeDef extends NodeDef {
	mode: string;
}

export interface ClipboardNodeOptions {
	mode: string;
}
