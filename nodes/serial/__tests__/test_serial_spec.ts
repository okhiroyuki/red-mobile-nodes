jest.mock('../../util');

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';
import TestServer from '../../testHelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../serial');
const mockPostRequest = jest.spyOn(util, 'postRequest');
const mockGetRequest = jest.spyOn(util, 'getRequest');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileWsPort: 1234,
  redMobileAccessKey: 'dummy_key',
  forceClose: true,
} as CustomLocalSetting);

describe('SerialNode', () => {
  let server: TestServer;

  beforeAll(() => {
    server = new TestServer(1234, '/mobile/serial');
  });

  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    mockPostRequest.mockClear();
    mockGetRequest.mockClear();
    helper.unload();
    helper.stopServer(done);
  });

  afterAll(() => {
    server.close();
  });

  it('should call serial-open on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'serial-open',
        baudRate: '9600',
        dataBits: '8',
        stopBits: '1',
        parity: 'none',
        dtr: false,
        rts: false,
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = { message: 'test message' };
      const expectedJson = {
        id: 'n1',
        method: 'serial-open',
        payload: mockPayload,
        options: {
          baudRate: '9600',
          dataBits: '8',
          stopBits: '1',
          parity: 'none',
          dtr: false,
          rts: false,
        },
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
    {
      data: 'test data',
      payload: 'test message',
      expected_payload: 'test data',
    },
    { data: '', payload: 'test message', expected_payload: 'test message' },
  ])(
    'should send with data is %s',
    ({ data, payload, expected_payload }, done) => {
      const flow = [
        {
          id: 'n1',
          type: 'serial-write',
          data: data,
          dataType: 'string',
        },
      ];
      helper.load(testNode, flow, () => {
        const n1 = helper.getNode('n1');

        const mockPayload = payload;
        const expectedJson = {
          id: 'n1',
          method: 'serial-write',
          payload: expected_payload,
          dataType: 'string',
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
  it('should send error when no payload', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'serial-write',
        data: '',
        dataType: 'string',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockError = jest.spyOn(n1, 'error');
      const mockStatus = jest.spyOn(n1, 'status');
      const mockPayload = '';
      n1.on('input', () => {
        try {
          expect(mockPostRequest).not.toHaveBeenCalled();
          expect(mockError).toHaveBeenCalledWith('serial-write.errors.payload');
          expect(mockStatus).toHaveBeenCalledWith({
            fill: 'red',
            shape: 'ring',
            text: 'serial-write.errors.payload',
          });
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({ payload: mockPayload });
    });
  });

  it('should call serial-close on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'serial-close',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = { message: 'test message' };
      const expectedJson = {
        id: 'n1',
        method: 'serial-close',
      };
      n1.on('input', () => {
        try {
          expect(mockGetRequest).toHaveBeenCalledWith(
            expect.anything(),
            n1,
            expect.anything(),
            expectedJson,
            5000
          );
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({ payload: mockPayload });
    });
  });

  it('should call serial-read on input', (done) => {
    const flow = [
      { id: 'n1', type: 'serial-read', wires: [['n2']] },
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
