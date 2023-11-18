import { NodeMessage } from 'node-red';
import { LocalSettings } from '@node-red/runtime';
import { BleNodeOptions } from './ble';
import { CameraNodeOptions } from './camera';
import { CameraCommandNodeOptions } from './camera-command';
import { ClipboardNodeOptions } from './clipboard';
import { QRCodeNodeOptions } from './qrcode';
import { SensorNodeOptions } from './sensor';
import { SerialOpenNodeOptions } from './serial';
export interface UtilJsonDef {
  id: string;
  method: string;
  payload?: NodeMessage['payload'];
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
  redMobileAccessKey: string;
}
