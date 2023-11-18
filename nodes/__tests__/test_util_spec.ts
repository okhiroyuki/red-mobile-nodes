import helper from 'node-red-node-test-helper';
import { generateGetConfig, generatePostConfig } from '../util';
import { NodeAPI } from 'node-red';
import { AxiosRequestConfig } from 'axios';
import { CustomLocalSetting } from '../@types/util';

jest.mock('axios');

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

  test('generatePostConfig', (done) => {
    const flow = [{ id: 'n1', type: 'test', name: 'test' }];
    let config: AxiosRequestConfig<string> = {};
    const testNode = (module.exports = function (RED: NodeAPI) {
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

  test('generateGetConfig', (done) => {
    const flow = [{ id: 'n1', type: 'test', name: 'test' }];
    let config: AxiosRequestConfig<string> = {};
    const testNode = (module.exports = function (RED: NodeAPI) {
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
});
