import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileStartActivityNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "intent-start-activity",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("start-activity", RedMobileStartActivityNode);
};
