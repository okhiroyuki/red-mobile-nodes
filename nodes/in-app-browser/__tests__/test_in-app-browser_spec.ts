jest.mock('../../util');

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';
import { RedMobileNodeMessage } from '../../@types/nodeAPI';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../in-app-browser');
const mockPostRequest = jest.spyOn(util, 'postRequest');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('InAppBrowserNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    mockPostRequest.mockClear();
    helper.unload();
    helper.stopServer(done);
  });

  it('should call openBrowser on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'browser open',
        target: 'system',
        url: 'test.com',
        options: '',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = 'test payload';
      const expectedJson = {
        id: 'n1',
        method: 'browser-open',
        payload: 'test.com',
        target: '_system',
        options: undefined,
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

  it('should call closeBrowser on input', (done) => {
    const flow = [{ id: 'n1', type: 'browser close' }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const expectedJson = {
        id: 'n1',
        method: 'browser-close',
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
      n1.receive({});
    });
  });

  it('should call openBrowser with msg.url on input', (done) => {
    const flow = [{ id: 'n1', type: 'browser open' }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = 'test payload';
      const expectedJson = {
        id: 'n1',
        method: 'browser-open',
        payload: mockPayload,
        target: '_system',
        options: undefined,
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

  it('should call openBrowser with msg.options on input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'browser open',
        target: 'system',
        url: 'test.com',
        options: '',
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');

      const mockPayload = 'test payload';
      const mockOptions = 'test options';
      const expectedJson = {
        id: 'n1',
        method: 'browser-open',
        payload: 'test.com',
        target: '_system',
        options: mockOptions,
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
      n1.receive({
        payload: mockPayload,
        options: mockOptions,
      } as RedMobileNodeMessage);
    });
  });
});
