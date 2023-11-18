import { NodeAPI } from 'node-red';
import { BleNodeDef, BleNodeOptions } from '../@types/ble';

export function generateBleOptions(
  RED: NodeAPI,
  props: BleNodeDef
): BleNodeOptions {
  const options: BleNodeOptions = {};
  if (RED.nodes.getNode(props.device)) {
    options.address = RED.nodes.getNode(props.device)['address'];
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
