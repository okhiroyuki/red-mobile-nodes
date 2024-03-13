import type { Node } from "node-red";
import type { RedNodeAPI } from "../../@types/nodeAPI";
import type { SensorNodeDef, SensorNodeOptions } from "../../@types/sensor";
import type { UtilJsonDef } from "../../@types/util";
import { postRequest } from "../../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileSensorSubscribeNode(this: Node, props: SensorNodeDef) {
		RED.nodes.createNode(this, props);
		const options: SensorNodeOptions = {
			sensor: props.sensor,
			freq: props.freq,
		};

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "sensor-subscribe",
				payload: msg.payload,
				options: options,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("sensor subscribe", RedMobileSensorSubscribeNode);
};
