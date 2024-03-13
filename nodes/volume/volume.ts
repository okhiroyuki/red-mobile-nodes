import type { Node } from "node-red";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import type { VolumeNodeDef } from "../@types/volume";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileVolumeGetNode(this: Node, props: VolumeNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json = {
				id: this.id,
				method: "volume-get",
				payload: msg.payload,
				target: props.target,
			};

			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("volume-get", RedMobileVolumeGetNode);

	function validateVolume(volume: number) {
		return volume >= 0 && volume <= 100;
	}

	function RedMobileVolumeSetNode(this: Node, props: VolumeNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			if (props.volume === -1) {
				if (
					msg.payload !== undefined &&
					typeof msg.payload === "number" &&
					validateVolume(msg.payload)
				) {
					props.volume = msg.payload;
				} else {
					this.error(RED._("volume.errors.volume"));
					this.status({
						fill: "red",
						shape: "ring",
						text: RED._("volume.errors.volume"),
					});
					return;
				}
			}
			const json: UtilJsonDef = {
				id: this.id,
				method: "volume-set",
				payload: msg.payload,
				volume: props.volume,
				target: props.target,
			};

			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("volume-set", RedMobileVolumeSetNode);
};
