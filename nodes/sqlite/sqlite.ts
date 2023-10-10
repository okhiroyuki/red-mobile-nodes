import { NodeAPI } from 'node-red';
import DB from './db';
import {
  SqliteNode,
  SqliteNodeDef,
  SqliteNodeMessageInFlow,
} from '../@types/sqlite';

module.exports = function (RED: NodeAPI) {
  function SqliteNodeDB(this: SqliteNode, props: SqliteNodeDef) {
    RED.nodes.createNode(this, props);

    this.dbname = props.db;
    this.mode = props.mode;
    const node = this;

    node.doConnect = function () {
      node.db = new DB(RED.settings, node.dbname);
    };

    node.on('close', function (done) {
      if (node.db) {
        node.db.close(node.id, done);
      } else {
        done();
      }
    });
  }
  RED.nodes.registerType('sqlitedb', SqliteNodeDB);

  function SqliteNodeIn(this: SqliteNode, props: SqliteNodeDef) {
    RED.nodes.createNode(this, props);
    this.mydb = props.mydb;
    this.sqlquery = props.sqlquery || 'msg.topic';
    this.sql = props.sql;
    this.mydbConfig = RED.nodes.getNode(this.mydb);
    const node = this;
    node.status({});

    if (node.mydbConfig) {
      node.mydbConfig.doConnect(node.id);
      node.status({ fill: 'green', shape: 'dot', text: this.mydbConfig.mod });
      let bind = [];

      const doQuery = function (msg: SqliteNodeMessageInFlow) {
        if (node.sqlquery == 'msg.topic') {
          if (typeof msg.topic === 'string') {
            if (msg.topic.length > 0) {
              bind = Array.isArray(msg.payload) ? msg.payload : [];
              node.mydbConfig.db.all(
                node.id,
                msg.topic,
                bind,
                function (err, row) {
                  if (err) {
                    node.error(err, msg);
                  } else {
                    msg.payload = row;
                    node.send(msg);
                  }
                }
              );
            }
          } else {
            node.error('msg.topic : the query is not defined as a string', msg);
            node.status({ fill: 'red', shape: 'dot', text: 'msg.topic error' });
          }
        }
        if (node.sqlquery == 'batch') {
          if (Array.isArray(msg.topic)) {
            if (msg.topic.length > 0) {
              node.mydbConfig.db.exec(node.id, msg.topic, function (err) {
                if (err) {
                  node.error(err, msg);
                } else {
                  msg.payload = [];
                  node.send(msg);
                }
              });
            }
          } else {
            node.error('msg.topic: the query is not defined as an array', msg);
            node.status({ fill: 'red', shape: 'dot', text: 'msg.topic error' });
          }
        }
        if (node.sqlquery == 'fixed') {
          if (typeof node.sql === 'string') {
            if (node.sql.length > 0) {
              node.mydbConfig.db.all(
                node.id,
                node.sql,
                bind,
                function (err, row) {
                  if (err) {
                    node.error(err, msg);
                  } else {
                    msg.payload = row;
                    node.send(msg);
                  }
                }
              );
            }
          } else {
            if (node.sql === null || node.sql == '') {
              node.error('SQL statement config not set up', msg);
              node.status({
                fill: 'red',
                shape: 'dot',
                text: 'SQL config not set up',
              });
            }
          }
        }
        if (node.sqlquery == 'prepared') {
          if (
            typeof node.sql === 'string' &&
            typeof msg.params !== 'undefined' &&
            Array.isArray(msg.params)
          ) {
            if (node.sql.length > 0) {
              node.mydbConfig.db.all(
                node.id,
                node.sql,
                msg.params,
                function (err, row) {
                  if (err) {
                    node.error(err, msg);
                  } else {
                    msg.payload = row;
                    node.send(msg);
                  }
                }
              );
            }
          } else {
            if (node.sql === null || node.sql == '') {
              node.error('Prepared statement config not set up', msg);
              node.status({
                fill: 'red',
                shape: 'dot',
                text: 'Prepared statement not set up',
              });
            }
            if (typeof msg.params == 'undefined') {
              node.error('msg.params not passed');
              node.status({
                fill: 'red',
                shape: 'dot',
                text: 'msg.params not defined',
              });
            } else if (!Array.isArray(msg.params)) {
              node.error('msg.params not an array');
              node.status({
                fill: 'red',
                shape: 'dot',
                text: 'msg.params not an array',
              });
            }
          }
        }
        if (node.sqlquery === 'delete') {
          node.mydbConfig.db.delete(node.id, function (err, result) {
            if (err) {
              node.error(err, msg);
            } else {
              msg.payload = result;
              node.send(msg);
            }
          });
        }
      };

      node.on('input', function (msg: SqliteNodeMessageInFlow) {
        if (msg && Object.prototype.hasOwnProperty.call(msg, 'extension')) {
          node.mydbConfig.db.loadExtension(msg.extension, function (err) {
            if (err) {
              node.error(err, msg);
            } else {
              doQuery(msg);
            }
          });
        } else {
          doQuery(msg);
        }
      });
    } else {
      node.error('Sqlite database not configured');
    }
  }
  RED.nodes.registerType('sqlite', SqliteNodeIn);
};
