import isBase64 from "is-base64";
import type { Node } from "node-red";
import type { BleNodeDef } from "../@types/ble";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";
import { generateBleOptions } from "./common";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileBleWriteNode(this: Node, props: BleNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			if (typeof msg.payload === "string" && isBase64(msg.payload)) {
				const json: UtilJsonDef = {
					id: this.id,
					method: "ble-write",
					payload: msg.payload,
					options: generateBleOptions(RED, props),
				};
				postRequest(RED, this, msg, json);
			} else {
				this.error("msg.payload must Base64 encoded string");
				this.status({
					fill: "red",
					shape: "ring",
					text: "error",
				});
			}
		});
	}

	RED.nodes.registerType("ble write", RedMobileBleWriteNode);
};
