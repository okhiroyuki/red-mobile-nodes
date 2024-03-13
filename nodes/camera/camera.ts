import type { Node } from "node-red";
import type { CameraNodeDef, CameraNodeOptions } from "../@types/camera";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function takePicture(this: Node, props: CameraNodeDef) {
		RED.nodes.createNode(this, props);

		const options: CameraNodeOptions = {
			quality: props.quality,
			destinationType: props.destinationType === "data" ? 0 : 1,
			saveToPhotoAlbum: props.saveToPhotoAlbum,
		};

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "camera",
				payload: msg.payload,
				options: options,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("camera", takePicture);
};
