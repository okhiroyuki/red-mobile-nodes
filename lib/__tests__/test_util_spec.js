// const axios = require('axios');
const helper = require('node-red-node-test-helper');
const qs = require('qs');
const util = require('../util.js');

jest.mock('axios');

const testNode = (module.exports = function (RED) {
  util.init(RED);
});

const PORT = 1880;
const ACCESS_KEY = 'dummy_key';

helper.init(require.resolve('node-red'), {
  redMobilePort: PORT,
  redMobileAccessKey: ACCESS_KEY,
});

describe('camera Node', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  test('generate post config', (done) => {
    const flow = [{ id: 'n1', type: 'test', name: 'test' }];
    helper.load(testNode, flow, function () {
      const generated_config = util.generatePostConfig({
        text: 'test',
        bool: false,
      });
      expect(generated_config.baseURL).toBe(`http://127.0.0.1:${PORT}`);
      expect(generated_config.url).toBe(`/mobile`);
      expect(generated_config.headers.Authorization).toBe(
        `Bearer: ${ACCESS_KEY}`
      );
      expect(generated_config.headers['Content-Type']).toBe(
        'application/x-www-form-urlencoded'
      );

      const parsed_data = qs.parse(generated_config.data);
      expect(parsed_data.text).toBe('test');
      expect(parsed_data.bool).toBe('false');
      done();
    });
  });
});
