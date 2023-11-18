import { NodeAPI, NodeAPISettingsWithData, NodeMessage } from 'node-red';

export interface RedNodeAPI extends NodeAPI {
  address?: string;
  settings: RedNodeAPISettingsWithData;
}

export interface RedNodeAPISettingsWithData extends NodeAPISettingsWithData {
  redMobileWsPort?: string;
  redMobileAccessKey?: string;
  redMobilePort?: string;
  forceClose?: boolean;
}

export interface RedMobileNodeMessage extends NodeMessage {
  options?: string;
}
