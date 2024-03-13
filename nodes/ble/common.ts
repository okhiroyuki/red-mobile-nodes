import type { NodeAPI } from "node-red";
import type { BleNode, BleNodeDef, BleNodeOptions } from "../@types/ble";

export function generateBleOptions(
	RED: NodeAPI,
	props: BleNodeDef,
): BleNodeOptions {
	const options: BleNodeOptions = {};
	const deviceNode: BleNode = RED.nodes.getNode(props.device);
	if (deviceNode) {
		options.address = deviceNode.address;
	}
	if (props.service) {
		options.service = props.service;
	}
	if (props.characteristic) {
		options.characteristic = props.characteristic;
	}
	if (props.timeout) {
		options.timeout = props.timeout;
	}
	return options;
}
