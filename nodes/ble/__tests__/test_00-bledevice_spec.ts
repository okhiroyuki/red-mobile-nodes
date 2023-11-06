import helper from 'node-red-node-test-helper';
import { BleNode } from '../../@types/ble';
import { CustomLocalSetting } from '../../@types/util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../00-bledevice');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('bleDevice node', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  it('should store address property', (done) => {
    const flow = [{ id: 'n1', type: 'bledevice', address: '12345' }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1') as BleNode;
      expect(n1).toHaveProperty('address', '12345');
      done();
    });
  });
});
