import type { Node, NodeDef } from "node-red";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function textRecognizer(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "text-recognizer",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("text recognizer", textRecognizer);

	function imageLabeler(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "image-labeler",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("image labeler", imageLabeler);

	function barcodeDetector(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "barcode-detector",
				payload: msg.payload,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("barcode detector", barcodeDetector);
};
