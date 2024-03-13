import type { NodeDef, NodeMessageInFlow } from "node-red";

export interface InAppBrowserNodeDef extends NodeDef {
	payload: string;
	url: string;
	options: string;
	target: string;
}

export interface InAppBrowserNodeMessageInFlow extends NodeMessageInFlow {
	options?: string;
}
