import axios from 'axios';
import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import qs from 'qs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require('../clipboard');

jest.mock('axios');

helper.init(require.resolve('node-red'), {
  redMobilePort: 1880,
  redMobileAccessKey: 'dummy_key',
} as CustomLocalSetting);

describe('ClipboardNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', (done) => {
    const flow = [{ id: 'n1', type: 'clipboard', name: 'test clipboard' }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');
      try {
        expect(n1).toHaveProperty('name', 'test clipboard');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should call postRequest on input', (done) => {
    const flow = [
      { id: 'n1', type: 'clipboard', mode: 'copy', wires: [['n2']] },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(testNode, flow, () => {
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

            expect(parsed_data.method).toBe('clipboard');
            expect(parsed_data.payload).toBe('test');
            expect(parsed_data.options).toEqual({
              mode: 'copy',
            });
          }
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