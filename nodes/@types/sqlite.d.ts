import { Node, NodeDef } from 'node-red';
export interface SqliteNode extends Node {
  dbname: string;
  mode: string;
  db: any;
  mydb: string;
  sqlquery: string;
  sql: string;
  mydbConfig: any;
}

export interface SqliteNodeDef extends NodeDef {
  dbname: string;
  mode: string;
  mydb: string;
  sqlquery: string;
  sql: string;
  mydbConfig: any;
}
