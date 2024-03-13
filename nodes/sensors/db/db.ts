import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../../@types/nodeAPI";
import type { UtilJsonDef } from "../../@types/util";
import { getRequest } from "../../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileDBNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "db",
			};
			getRequest(RED, this, msg, json, 5000);
		});
	}

	RED.nodes.registerType("db", RedMobileDBNode);
};
