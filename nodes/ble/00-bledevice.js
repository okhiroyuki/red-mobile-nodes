module.exports = (RED) => {
  'use strcit';

  function bleDevice(n) {
    RED.nodes.createNode(this, n);
    this.address = n.address;
  }
  RED.nodes.registerType('bledevice', bleDevice);
};
