import { Node, NodeDef, NodeMessageInFlow } from 'node-red';
export interface SqliteNode extends Node {
  dbname: string;
  mode: string;
  db: any;
  mydb: string;
  sqlquery: string;
  sql: string;
  mydbConfig: any;
  doConnect: () => void;
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
  params: string;
}
