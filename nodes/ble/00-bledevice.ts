import type { NodeAPI } from "node-red";
import type { BleNode, BleNodeDef } from "../@types/ble";

module.exports = (RED: NodeAPI) => {
	function bleDevice(this: BleNode, props: BleNodeDef) {
		RED.nodes.createNode(this, props);
		this.address = props.address;
	}
	RED.nodes.registerType("bledevice", bleDevice);
};
