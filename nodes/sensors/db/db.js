module.exports = function (RED) {
  'use strcit';

  const util = require('../../../lib/util');
  util.init(RED);

  function RedMobileDBNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'db',
      };
      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('db', RedMobileDBNode);
};
