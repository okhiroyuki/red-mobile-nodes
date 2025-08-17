import type { Node, NodeDef } from "node-red";
import { EventEmitter } from "ws";
import type { RedNodeAPI } from "../@types/nodeAPI";
import type {
	SerialOpenNodeDef,
	SerialOpenNodeOptions,
	SerialWriteNodeDef,
} from "../@types/serial";
import type { UtilJsonDef } from "../@types/util";
import { getRequest, postRequest } from "../util";
import { open } from "../WebSocketHelper";

module.exports = (RED: RedNodeAPI) => {
	const ev = new EventEmitter();
	open(RED, ev, "/mobile/serial");

	function RedMobileSerialOpenNode(this: Node, props: SerialOpenNodeDef) {
		RED.nodes.createNode(this, props);
		const options: SerialOpenNodeOptions = {
			baudRate: props.baudRate,
			dataBits: props.dataBits,
			stopBits: props.stopBits,
			parity: props.parity,
			dtr: props.dtr,
			rts: props.rts,
		};

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "serial-open",
				payload: msg.payload,
				options: options,
			};
			postRequest(RED, this, msg, json);
		});
	}

	RED.nodes.registerType("serial-open", RedMobileSerialOpenNode);

	function RedMobileSerialCloseNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const params: UtilJsonDef = {
				id: this.id,
				method: "serial-close",
			};
			getRequest(RED, this, msg, params, 5000);
		});
	}

	RED.nodes.registerType("serial-close", RedMobileSerialCloseNode);

	function RedMobileSerialWriteNode(this: Node, props: SerialWriteNodeDef) {
		RED.nodes.createNode(this, props);

		this.on("input", (msg) => {
			const json: UtilJsonDef = {
				id: this.id,
				method: "serial-write",
				payload: props.data ? props.data : msg.payload,
				dataType: props.dataType,
			};
			if (json.payload) {
				postRequest(RED, this, msg, json);
			} else {
				this.error(RED._("serial-write.errors.payload"));
				this.status({
					fill: "red",
					shape: "ring",
					text: RED._("serial-write.errors.payload"),
				});
			}
		});
	}

	RED.nodes.registerType("serial-write", RedMobileSerialWriteNode);

	function RedMobileSerialReadNode(this: Node, props: NodeDef) {
		RED.nodes.createNode(this, props);
		ev.on("message", (data) => {
			const payload = JSON.parse(data).payload;
			if (payload) {
				this.send({ payload: payload });
			}
		});
	}

	RED.nodes.registerType("serial-read", RedMobileSerialReadNode);
};
