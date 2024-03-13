import type { NodeDef } from "node-red";

export interface QRCodeNodeDef extends NodeDef {
	camera: string;
	showFlipCameraButton: string;
	showTorchButton: string;
	torchOn: string;
	orientation: string;
	prompt: string;
}

export interface QRCodeNodeOptions {
	preferFrontCamera: boolean;
	showFlipCameraButton: string;
	showTorchButton: string;
	torchOn: string;
	orientation: string;
	prompt: string;
}
