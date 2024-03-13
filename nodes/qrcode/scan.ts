import type { Node } from "node-red";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { QRCodeNodeDef, QRCodeNodeOptions } from "../@types/qrcode";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function startQRCode(this: Node, props: QRCodeNodeDef) {
		RED.nodes.createNode(this, props);
		const options: QRCodeNodeOptions = {
			preferFrontCamera: props.camera === "front",
			showFlipCameraButton: props.showFlipCameraButton,
			showTorchButton: props.showTorchButton,
			torchOn: props.torchOn,
			orientation: props.orientation,
			prompt: props.prompt,
		};

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "qrcode-scan",
				payload: msg.payload,
				options: options,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("qrcode scan", startQRCode);
};
