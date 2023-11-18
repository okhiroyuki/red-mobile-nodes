import { NodeDef } from 'node-red';

export interface SensorNodeDef extends NodeDef {
  sensor: string;
  freq?: string;
}

export interface SensorNodeOptions {
  sensor: string;
  freq?: string;
}
