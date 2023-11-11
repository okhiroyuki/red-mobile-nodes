jest.mock('axios');

import helper from 'node-red-node-test-helper';
import {
  generateGetConfig,
  generatePostConfig,
  sendSuccess,
  sendError,
} from '../util';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CustomLocalSetting } from '../@types/util';
import { RedNodeAPI } from '../@types/nodeAPI';
import { Node, NodeMessageInFlow } from 'node-red';

const PORT = 1880;
const ACCESS_KEY = 'dummy_key';

helper.init(require.resolve('node-red'), {
  redMobilePort: PORT,
  redMobileAccessKey: ACCESS_KEY,
} as CustomLocalSetting);

describe('util', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  test('generateGetConfig', (done) => {
    const flow = [{ id: 'n1', type: 'test', name: 'test' }];
    let config: AxiosRequestConfig<string> = {};
    const testNode = (module.exports = function (RED: RedNodeAPI) {
      config = generateGetConfig(RED, 'test', 1000);
    });
    helper.load(testNode, flow, function () {
      expect(config.baseURL).toBe(`http://127.0.0.1:${PORT}`);
      expect(config.url).toBe('/mobile');
      expect(config.params).toBe('test');
      expect(config.timeout).toBe(1000);
      if (config.headers) {
        expect(config.headers.Authorization).toBe(`Bearer: ${ACCESS_KEY}`);
        expect(config.headers['Content-Type']).toBe('application/json');
        done();
      }
    });
  });

  it('should send the correct message and set node status', () => {
    const mockSend = jest.fn();
    const mockStatus = jest.fn();

    const msg: NodeMessageInFlow = { _msgid: '1234' };
    const node: Partial<Node> = {
      send: mockSend,
      status: mockStatus,
    };

    const mockResponse: AxiosResponse<any> = {
      data: 'test data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
      request: {},
    };

    sendSuccess(node as Node, msg, mockResponse);

    expect(mockSend).toHaveBeenCalledWith({
      _msgid: '1234',
      payload: 'test data',
    });

    expect(mockStatus).toHaveBeenCalledWith({
      fill: 'blue',
      shape: 'dot',
      text: 'success',
    });
  });

  it('should send the correct error message and set node status', () => {
    const mockError = jest.fn();
    const mockStatus = jest.fn();

    // Nodeオブジェクトのモックを作成
    const node: Partial<Node> = {
      error: mockError,
      status: mockStatus,
    };

    // モックエラーオブジェクト
    const mockErr = {
      response: {
        data: 'error message',
      },
    };

    // sendErrorをテスト
    sendError(node as Node, mockErr);

    expect(mockError).toHaveBeenCalledWith('error message');

    expect(mockStatus).toHaveBeenCalledWith({
      fill: 'red',
      shape: 'ring',
      text: 'error message',
    });
  });

  test('generatePostConfig', (done) => {
    const flow = [{ id: 'n1', type: 'test', name: 'test' }];
    let config: AxiosRequestConfig<string> = {};
    const testNode = (module.exports = (RED: RedNodeAPI) => {
      config = generatePostConfig(RED);
    });
    helper.load(testNode, flow, function () {
      expect(config.baseURL).toBe(`http://127.0.0.1:${PORT}`);
      if (config.headers) {
        expect(config.headers.Authorization).toBe(`Bearer: ${ACCESS_KEY}`);
        expect(config.headers['Content-Type']).toBe(
          'application/x-www-form-urlencoded'
        );
        done();
      }
    });
  });
});
