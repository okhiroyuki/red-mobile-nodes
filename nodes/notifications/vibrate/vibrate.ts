import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../../@types/nodeAPI";
import type { UtilJsonDef } from "../../@types/util";
import { postRequest } from "../../util";

module.exports = (RED: RedNodeAPI) => {
	function sendError(node: Node) {
		node.error(RED._("vibrate.errors.response"));
		node.status({
			fill: "red",
			shape: "ring",
			text: RED._("vibrate.errors.response"),
		});
	}

	function RedMobileVibrateNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			if (msg.payload === undefined || !Array.isArray(msg.payload)) {
				sendError(this);
				return;
			}
			const json: UtilJsonDef = {
				id: this.id,
				method: "vibrate",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("vibrate", RedMobileVibrateNode);
};
