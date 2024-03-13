import type { Node } from "node-red";
import type { BleNodeDef } from "../@types/ble";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";
import { generateBleOptions } from "./common";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileBleScanNode(this: Node, props: BleNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "ble-scan",
				payload: msg.payload,
				options: generateBleOptions(RED, props),
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("ble scan", RedMobileBleScanNode);
};
