import { NodeDef, Node } from 'node-red';

export interface BleNode extends Node {
  address?: string;
}

export interface BleNodeDef extends NodeDef {
  device: string;
  timeout?: number;
  address?: string;
  service?: string;
  characteristic?: string;
}

export interface BleNodeOptions {
  timeout?: number;
  address?: string;
  service?: string;
  characteristic?: string;
}
