import type { NodeAPI } from "node-red";
import type {
	SqliteNode,
	SqliteNodeDef,
	SqliteNodeMessageInFlow,
} from "../@types/sqlite";
import DB from "./db";

module.exports = (RED: NodeAPI) => {
	function SqliteNodeDB(this: SqliteNode, props: SqliteNodeDef) {
		RED.nodes.createNode(this, props);

		this.dbname = props.db;
		this.mode = props.mode;

		this.doConnect = () => {
			this.db = new (DB as any)(RED.settings, this.dbname);
		};

		this.on("close", (done: () => void) => {
			if (this.db) {
				this.db.close(this.id, done);
			} else {
				done();
			}
		});
	}
	RED.nodes.registerType("sqlitedb", SqliteNodeDB);

	function SqliteNodeIn(this: SqliteNode, props: SqliteNodeDef) {
		RED.nodes.createNode(this, props);
		this.mydb = props.mydb;
		this.sqlquery = props.sqlquery || "msg.topic";
		this.sql = props.sql;
		this.mydbConfig = RED.nodes.getNode(this.mydb);
		this.status({});

		if (this.mydbConfig) {
			this.mydbConfig.doConnect(this.id);
			this.status({ fill: "green", shape: "dot", text: this.mydbConfig.mod });
			let bind: string[] = [];

			const doQuery = (msg: SqliteNodeMessageInFlow) => {
				if (this.sqlquery === "msg.topic") {
					if (typeof msg.topic === "string") {
						if (msg.topic.length > 0) {
							bind = Array.isArray(msg.payload) ? msg.payload : [];
							this.mydbConfig.db.all(
								this.id,
								msg.topic,
								bind,
								(err: Error, row: any) => {
									if (err) {
										this.error(err, msg);
									} else {
										msg.payload = row;
										this.send(msg);
									}
								},
							);
						}
					} else {
						this.error("msg.topic : the query is not defined as a string", msg);
						this.status({ fill: "red", shape: "dot", text: "msg.topic error" });
					}
				}
				if (this.sqlquery === "batch") {
					if (Array.isArray(msg.topic)) {
						if (msg.topic.length > 0) {
							this.mydbConfig.db.exec(this.id, msg.topic, (err: Error) => {
								if (err) {
									this.error(err, msg);
								} else {
									msg.payload = [];
									this.send(msg);
								}
							});
						}
					} else {
						this.error("msg.topic: the query is not defined as an array", msg);
						this.status({ fill: "red", shape: "dot", text: "msg.topic error" });
					}
				}
				if (this.sqlquery === "fixed") {
					if (typeof this.sql === "string") {
						if (this.sql.length > 0) {
							this.mydbConfig.db.all(
								this.id,
								this.sql,
								bind,
								(err: Error, row: any) => {
									if (err) {
										this.error(err, msg);
									} else {
										msg.payload = row;
										this.send(msg);
									}
								},
							);
						}
					} else if (this.sql === null || this.sql === "") {
						this.error("SQL statement config not set up", msg);
						this.status({
							fill: "red",
							shape: "dot",
							text: "SQL config not set up",
						});
					}
				}
				if (this.sqlquery === "prepared") {
					if (
						typeof this.sql === "string" &&
						typeof msg.params !== "undefined" &&
						Array.isArray(msg.params)
					) {
						if (this.sql.length > 0) {
							this.mydbConfig.db.all(
								this.id,
								this.sql,
								msg.params,
								(err: Error, row: any) => {
									if (err) {
										this.error(err, msg);
									} else {
										msg.payload = row;
										this.send(msg);
									}
								},
							);
						}
					} else {
						if (this.sql === null || this.sql === "") {
							this.error("Prepared statement config not set up", msg);
							this.status({
								fill: "red",
								shape: "dot",
								text: "Prepared statement not set up",
							});
						}
						if (typeof msg.params === "undefined") {
							this.error("msg.params not passed");
							this.status({
								fill: "red",
								shape: "dot",
								text: "msg.params not defined",
							});
						} else if (!Array.isArray(msg.params)) {
							this.error("msg.params not an array");
							this.status({
								fill: "red",
								shape: "dot",
								text: "msg.params not an array",
							});
						}
					}
				}
				if (this.sqlquery === "delete") {
					this.mydbConfig.db.delete(this.id, (err: Error, result: any) => {
						if (err) {
							this.error(err, msg);
						} else {
							msg.payload = result;
							this.send(msg);
						}
					});
				}
			};

			this.on("input", (msg: SqliteNodeMessageInFlow) => {
				if (msg && Object.hasOwn(msg, "extension")) {
					this.mydbConfig.db.loadExtension(msg.extension, (err: Error) => {
						if (err) {
							this.error(err, msg);
						} else {
							doQuery(msg);
						}
					});
				} else {
					doQuery(msg);
				}
			});
		} else {
			this.error("Sqlite database not configured");
		}
	}
	RED.nodes.registerType("sqlite", SqliteNodeIn);
};
