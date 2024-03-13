import type { NodeDef } from "node-red";

export interface VolumeNodeDef extends NodeDef {
	volume: number;
	target: string;
}
