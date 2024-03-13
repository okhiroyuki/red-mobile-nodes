import type { Node } from "node-red";
import type {
	ClipboardNodeDef,
	ClipboardNodeOptions,
} from "../@types/clipboard";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileClipboardNode(this: Node, props: ClipboardNodeDef) {
		RED.nodes.createNode(this, props);

		const options: ClipboardNodeOptions = {
			mode: props.mode,
		};

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "clipboard",
				payload: msg.payload,
				options: options,
			};
			postRequest(RED, this, msg, json);
		});
	}
	RED.nodes.registerType("clipboard", RedMobileClipboardNode);
};
