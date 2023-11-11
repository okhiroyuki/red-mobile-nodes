jest.mock('../../util');
jest.mock('../common', () => ({
  generateBleOptions: jest.fn().mockImplementation(() => {
    return { address: '1234' };
  }),
}));

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../04-disconnect');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('BleScanNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  it('should call postRequest on input', (done) => {
    const flow = [{ id: 'n1', type: 'ble disconnect', device: 'bledevice' }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPostRequest = jest.spyOn(util, 'postRequest');
      const mockPayload = 'test payload';
      const expectedJson = {
        id: 'n1',
        method: 'ble-disconnect',
        payload: mockPayload,
        options: { address: '1234' },
      };

      n1.on('input', () => {
        try {
          expect(mockPostRequest).toHaveBeenCalledWith(
            expect.anything(),
            n1,
            expect.anything(),
            expectedJson
          );
          done();
        } catch (err) {
          done(err);
        }
      });

      n1.receive({ payload: mockPayload });
    });
  });
});
