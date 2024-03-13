import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../../@types/nodeAPI";
import type { UtilJsonDef } from "../../@types/util";
import { postRequest } from "../../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileBeepNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			if (msg.payload === undefined || typeof msg.payload !== "number") {
				sendError(this);
				return;
			}
			const json: UtilJsonDef = {
				id: this.id,
				method: "beep",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});

		function sendError(node: Node) {
			node.error(RED._("beep.errors.response"));
			node.status({
				fill: "red",
				shape: "ring",
				text: RED._("beep.errors.response"),
			});
		}
	}
	RED.nodes.registerType("beep", RedMobileBeepNode);
};
