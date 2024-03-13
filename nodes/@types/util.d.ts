import type { LocalSettings } from "@node-red/runtime";
import type { NodeMessage } from "node-red";
import type { BleNodeOptions } from "./ble";
import type { CameraNodeOptions } from "./camera";
import type { CameraCommandNodeOptions } from "./camera-command";
import type { ClipboardNodeOptions } from "./clipboard";
import type { QRCodeNodeOptions } from "./qrcode";
import type { SensorNodeOptions } from "./sensor";
import type { SerialOpenNodeOptions } from "./serial";
export interface UtilJsonDef {
	id: string;
	method: string;
	payload?: NodeMessage["payload"];
	target?: string;
	volume?: number;
	dataType?: string;
	options?:
		| BleNodeOptions
		| CameraNodeOptions
		| CameraCommandNodeOptions
		| ClipboardNodeOptions
		| QRCodeNodeOptions
		| SensorNodeOptions
		| SerialOpenNodeOptions
		| string;
}

export interface CustomLocalSetting extends LocalSettings {
	redMobilePort: number;
	redMobileWsPort: number;
	redMobileAccessKey: string;
	forceClose?: boolean;
}
