import axios from 'axios';
import helper from 'node-red-node-test-helper';
import qs from 'qs';
import { CustomLocalSetting } from '../../@types/util';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cameraNode = require('../camera');
jest.mock('axios');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

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
      const mockPost = jest.spyOn(axios, 'post');
      const RESPONSE_VALUE = 'response';
      mockPost.mockImplementation((url): any => {
        if (url === '/mobile') {
          return Promise.resolve({ data: RESPONSE_VALUE });
        }
      });
      n2.on('input', function (msg) {
        try {
          expect(msg).toHaveProperty('payload', RESPONSE_VALUE);
          expect(mockPost.mock.calls.length).toBe(1);
          expect(mockPost.mock.calls[0].length).toBe(3);

          const mock_calls = mockPost.mock.calls[0][1];
          if (typeof mock_calls === 'string') {
            const parsed_data = qs.parse(mock_calls);
            expect(parsed_data.method).toBe('camera');
            expect(parsed_data.payload).toBe('test');
            if (parsed_data.options) {
              expect(parsed_data.options['quality']).toBe('50');
              expect(parsed_data.options['destinationType']).toBe('0');
              expect(parsed_data.options['saveToPhotoAlbum']).toBe('false');
            }
            done();
          }
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
