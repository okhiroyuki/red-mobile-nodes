import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../../@types/nodeAPI";
import type { UtilJsonDef } from "../../@types/util";
import { postRequest } from "../../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobilePromptNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			if (msg.payload === undefined || typeof msg.payload !== "object") {
				sendError(this);
				return;
			}
			const json: UtilJsonDef = {
				id: this.id,
				method: "prompt",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	function sendError(node: Node) {
		node.error(RED._("prompt.errors.response"));
		node.status({
			fill: "red",
			shape: "ring",
			text: RED._("prompt.errors.response"),
		});
	}

	RED.nodes.registerType("prompt", RedMobilePromptNode);
};
