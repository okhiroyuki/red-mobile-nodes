jest.mock('../../util');

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../mlkit');
const mockPostRequest = jest.spyOn(util, 'postRequest');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('MLKitNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    mockPostRequest.mockClear();
    helper.unload();
    helper.stopServer(done);
  });

  it('should call text-recognizer on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'text recognizer',
        name: 'test name',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = 'test payload';
      const expectedJson = {
        id: 'n1',
        method: 'text-recognizer',
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

  it('should call image-labeler on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'image labeler',
        name: 'test name',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = 'test payload';
      const expectedJson = {
        id: 'n1',
        method: 'image-labeler',
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

  it('should call barcode-detector on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'barcode detector',
        name: 'test name',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = 'test payload';
      const expectedJson = {
        id: 'n1',
        method: 'barcode-detector',
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
});
