const axios = require('axios');
const helper = require('node-red-node-test-helper');
const cameraNode = require('../camera.js');
const qs = require('qs');

const PORT = 1880;

jest.mock('axios');

helper.init(require.resolve('node-red'), {
  redMobilePort: PORT,
  redMobileAccessKey: 'key',
});

describe('camera Node', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  test('should be loaded', (done) => {
    const flow = [{ id: 'n1', type: 'camera', name: 'camera' }];
    helper.load(cameraNode, flow, function () {
      const n1 = helper.getNode('n1');
      try {
        expect(n1).toHaveProperty('name', 'camera');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  test('should make payload', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'camera',
        quality: 50,
        destinationType: 'data',
        saveToPhotoAlbum: false,
        name: 'camera',
        wires: [['n2']],
      },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(cameraNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');
      const mockRequest = jest.spyOn(axios, 'request');
      const RESPONSE_VALUE = 'response';
      mockRequest.mockReturnValue(Promise.resolve({ data: RESPONSE_VALUE }));

      n2.on('input', function (msg) {
        try {
          expect(msg).toHaveProperty('payload', RESPONSE_VALUE);
          expect(mockRequest.mock.calls).toHaveLength(1);

          const mock_calls = mockRequest.mock.calls[0][0];
          expect(mock_calls.baseURL).toBe(`http://127.0.0.1:${PORT}`);
          expect(mock_calls.url).toBe('/mobile');
          expect(mock_calls.method).toBe('post');

          const parsed_data = qs.parse(mock_calls.data);
          expect(parsed_data.method).toBe('camera');
          expect(parsed_data.payload).toBe('test');
          expect(parsed_data.options.quality).toBe('50');
          expect(parsed_data.options.destinationType).toBe('0');
          expect(parsed_data.options.saveToPhotoAlbum).toBe('false');
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({
        payload: 'test',
      });
    });
  });
});
