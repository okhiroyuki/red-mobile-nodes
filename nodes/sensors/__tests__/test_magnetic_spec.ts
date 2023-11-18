import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import TestServer from '../../testHelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../magnetic/magnetic');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileWsPort: 1234,
  redMobileAccessKey: 'dummy_key',
  forceClose: true,
} as CustomLocalSetting);

describe('MagneticNode', () => {
  let server: TestServer;

  beforeAll(() => {
    server = new TestServer(1234, '/mobile/magnetic');
  });

  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  afterAll(() => {
    server.close();
  });

  it('should handle WebSocket messages', (done) => {
    const flow = [
      { id: 'n1', type: 'magnetic', wires: [['n2']] },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(testNode, flow, () => {
      const n2 = helper.getNode('n2');
      n2.on('input', (msg) => {
        expect(msg.payload).toEqual('test payload');
        done();
      });
      server.send('test payload');
    });
  });
});
