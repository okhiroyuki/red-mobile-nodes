import { Node, NodeDef, NodeMessage, NodeMessageInFlow } from 'node-red';
export interface SqliteNode extends Node {
  dbname: string;
  mode: string;
  db: any;
  mydb: string;
  sqlquery: string;
  sql: string;
  mydbConfig: any;
  doConnect: () => void;

  on(
    event: 'input',
    listener: (
      msg: SqliteNodeMessageInFlow,
      send: (
        msg: NodeMessage | Array<NodeMessage | NodeMessage[] | null>
      ) => void,
      done: (err?: Error) => void
    ) => void
  ): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'close', listener: (done: () => void) => void): this; // tslint:disable-line:unified-signatures
  on(
    event: 'close',
    listener: (removed: boolean, done: () => void) => void
  ): this; // tslint:disable-line:unified-signatures
}

export interface SqliteNodeDef extends NodeDef {
  dbname: string;
  mode: string;
  db: string;
  mydb: string;
  sqlquery: string;
  sql: string;
  mydbConfig: any;
}

export interface SqliteNodeMessageInFlow extends NodeMessageInFlow {
  extension: string;
  params: [];
}
