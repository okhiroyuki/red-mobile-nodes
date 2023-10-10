import { NodeDef } from 'node-red';

export interface CameraCommandNodeDef extends NodeDef {
  preview: string;
  direction: string;
}

export interface CameraCommandNodeOptions {
  toBack: boolean;
  direction: string;
}
