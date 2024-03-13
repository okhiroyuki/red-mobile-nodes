import type { NodeDef } from "node-red";

export interface CameraNodeDef extends NodeDef {
	quality: string;
	destinationType: string;
	saveToPhotoAlbum: boolean;
}

export interface CameraNodeOptions {
	quality: string;
	destinationType: number;
	saveToPhotoAlbum: boolean;
}
