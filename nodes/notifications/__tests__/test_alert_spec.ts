jest.mock('../../util');

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../alert/alert');
const mockPostRequest = jest.spyOn(util, 'postRequest');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('AlertNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    mockPostRequest.mockClear();
    helper.unload();
    helper.stopServer(done);
  });

  it('should call alert on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'alert',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = { message: 'test message' };
      const expectedJson = {
        id: 'n1',
        method: 'alert',
        payload: mockPayload,
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

  it('should send error when payload is not an object', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'alert',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockError = jest.spyOn(n1, 'error');
      const mockStatus = jest.spyOn(n1, 'status');
      const mockPayload = 'test payload';
      n1.on('input', () => {
        try {
          expect(mockPostRequest).not.toHaveBeenCalled();
          expect(mockError).toHaveBeenCalledWith('alert.errors.response');
          expect(mockStatus).toHaveBeenCalledWith({
            fill: 'red',
            shape: 'ring',
            text: 'alert.errors.response',
          });
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({ payload: mockPayload });
    });
  });
});
