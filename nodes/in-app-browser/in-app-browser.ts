import type { Node, NodeDef } from "node-red";
import type {
	InAppBrowserNodeDef,
	InAppBrowserNodeMessageInFlow,
} from "../@types/in_app_browser";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type { UtilJsonDef } from "../@types/util";
import { postRequest } from "../util";

module.exports = (RED: RedNodeAPI) => {
	function BrowserOpen(this: Node, props: InAppBrowserNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg: InAppBrowserNodeMessageInFlow) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "browser-open",
				payload: props.url ? props.url : msg.payload,
				target: props.target === "blank" ? "_blank" : "_system",
				options: props.options ? props.options : msg.options,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("browser open", BrowserOpen);

	function BrowserClose(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "browser-close",
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("browser close", BrowserClose);
};
