import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../../@types/nodeAPI";
import type { UtilJsonDef } from "../../@types/util";
import { postRequest } from "../../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileConfirmNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			if (msg.payload === undefined || typeof msg.payload !== "object") {
				sendError(this);
				return;
			}
			const json: UtilJsonDef = {
				id: this.id,
				method: "confirm",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	function sendError(node: Node) {
		node.error(RED._("confirm.errors.response"));
		node.status({
			fill: "red",
			shape: "ring",
			text: RED._("confirm.errors.response"),
		});
	}

	RED.nodes.registerType("confirm", RedMobileConfirmNode);
};
