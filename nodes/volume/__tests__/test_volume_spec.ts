jest.mock('../../util');

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';
const mockPostRequest = jest.spyOn(util, 'postRequest');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../volume');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('VolumeNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    mockPostRequest.mockClear();
    helper.unload();
    helper.stopServer(done);
  });

  it('should call volume get node', (done) => {
    const flow = [{ id: 'n1', type: 'volume-get', target: 'alarm' }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');
      const mockPayload = 'test message'; // Example payload
      const expectedJson = {
        id: 'n1',
        method: 'volume-get',
        payload: mockPayload,
        target: 'alarm',
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

  it('should call volume set node', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'volume-set',
        volume: 50,
        target: 'alarm',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');
      const mockPayload = 'test message'; // Example payload
      const expectedJson = {
        id: 'n1',
        method: 'volume-set',
        payload: mockPayload,
        volume: 50,
        target: 'alarm',
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

  test.each([
    { payload: 0, expected: 0 },
    { payload: 100, expected: 100 },
    { payload: 50, expected: 50 },
  ])(
    'should set volume to %s when input payload is %s',
    ({ payload, expected }, done) => {
      const flow = [
        {
          id: 'n1',
          type: 'volume-set',
          volume: -1,
          target: 'alarm',
        },
      ];
      helper.load(testNode, flow, () => {
        const n1 = helper.getNode('n1');

        const mockPayload = payload;
        const expectedJson = {
          id: 'n1',
          method: 'volume-set',
          payload: mockPayload,
          volume: expected,
          target: 'alarm',
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
    }
  );

  test.each([{ payload: -1 }, { payload: 101 }])(
    'should set volume to %s when input payload is %s',
    ({ payload }, done) => {
      const flow = [
        {
          id: 'n1',
          type: 'volume-set',
          volume: -1,
          target: 'alarm',
        },
      ];
      helper.load(testNode, flow, () => {
        const n1 = helper.getNode('n1');

        const mockPayload = payload;
        const mockError = jest.spyOn(n1, 'error');
        const mockStatus = jest.spyOn(n1, 'status');
        n1.on('input', () => {
          try {
            expect(mockError).toHaveBeenCalledWith('volume.errors.volume');
            expect(mockStatus).toHaveBeenCalledWith({
              fill: 'red',
              shape: 'ring',
              text: 'volume.errors.volume',
            });
            expect(mockPostRequest).not.toHaveBeenCalled();
            done();
          } catch (err) {
            done(err);
          }
        });
        n1.receive({ payload: mockPayload });
      });
    }
  );
});
