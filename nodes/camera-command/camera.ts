import type { Node } from "node-red";
import type {
	CameraCommandNodeDef,
	CameraCommandNodeOptions,
} from "../@types/camera-command";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { getRequest, postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function RedMobileCameraOpenNode(this: Node, props: CameraCommandNodeDef) {
		RED.nodes.createNode(this, props);

		const options: CameraCommandNodeOptions = {
			toBack: false,
			direction: "back",
		};
		if (props.preview === "enable") {
			options.toBack = false;
		} else {
			options.toBack = true;
		}
		if (props.direction) {
			options.direction = props.direction;
		} else {
			options.direction = "back";
		}

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "camera-open",
				payload: msg.payload,
				options: options,
			};

			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("camera-open", RedMobileCameraOpenNode);

	function RedMobileCameraCloseNode(this: Node, props: CameraCommandNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const params = {
				id: this.id,
				method: "camera-close",
			};

			getRequest(RED, this, msg, params, 5000);
		});
	}

	RED.nodes.registerType("camera-close", RedMobileCameraCloseNode);

	function RedMobileTakePictureNode(this: Node, props: CameraCommandNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const params = {
				id: this.id,
				method: "camera-take-picture",
			};
			getRequest(RED, this, msg, params, 5000);
		});
	}

	RED.nodes.registerType("take-picture", RedMobileTakePictureNode);

	function RedMobileCameraSwitchNode(this: Node, props: CameraCommandNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const params = {
				id: this.id,
				method: "camera-switch",
			};
			getRequest(RED, this, msg, params, 5000);
		});
	}

	RED.nodes.registerType("camera-switch", RedMobileCameraSwitchNode);
};
