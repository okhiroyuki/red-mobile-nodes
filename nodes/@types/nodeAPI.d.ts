import { NodeAPI, NodeAPISettingsWithData } from 'node-red';

export interface RedNodeAPI extends NodeAPI {
  address?: string;
  settings: RedNodeAPISettingsWithData;
}

export interface RedNodeAPISettingsWithData extends NodeAPISettingsWithData {
  redMobileWsPort?: string;
  redMobileAccessKey?: string;
  redMobilePort?: string;
}
