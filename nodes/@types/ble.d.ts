import { NodeDef } from 'node-red';

export interface BleNodeDef extends NodeDef {
  device?: string;
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
