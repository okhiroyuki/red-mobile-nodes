import { NodeDef } from 'node-red';

export interface SerialOpenNodeDef extends NodeDef {
  baudRate: string;
  dataBits: string;
  stopBits: string;
  parity: string;
  dtr: string;
  rts: string;
}

export interface SerialOpenNodeOptions {
  baudRate: string;
  dataBits: string;
  stopBits: string;
  parity: string;
  dtr: string;
  rts: string;
}

export interface SerialWriteNodeDef extends NodeDef {
  data: string;
  dataType: string;
}
