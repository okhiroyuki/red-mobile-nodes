import type { Node } from "node-red";
import { EventEmitter } from "ws";
import type { BleNodeDef } from "../@types/ble";
import type { RedNodeAPI } from "../@types/nodeAPI";
import { open } from "../WebSocketHelper";

module.exports = (RED: RedNodeAPI) => {
	const ev = new EventEmitter();
	open(RED, ev, "/mobile/ble");

	function RedMobileBleNotificationNode(this: Node, props: BleNodeDef) {
		RED.nodes.createNode(this, props);

		ev.on("message", (data) => {
			this.send({ payload: JSON.parse(data).payload });
		});
	}

	RED.nodes.registerType("ble notification", RedMobileBleNotificationNode);
};
