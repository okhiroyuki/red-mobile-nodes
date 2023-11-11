jest.mock('../../util');

import helper from 'node-red-node-test-helper';
import { CustomLocalSetting } from '../../@types/util';
import * as util from '../../util';

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
    helper.unload();
    helper.stopServer(done);
  });

  it('should call postRequest with correct parameters on input', (done) => {
    const flow = [{ id: 'n1', type: 'volume-get', wires: [['n2']] }];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');
      const mockPayload = { volume: 50 }; // Example payload
      const expectedJson = {
        id: 'n1',
        method: 'volume-get',
        payload: mockPayload,
        target: undefined, // Assuming target is undefined in this test case
      };

      jest
        .spyOn(util, 'postRequest')
        .mockImplementation((RED, node, msg, json) => {
          expect(json).toEqual(expectedJson);
          done();
        });

      n1.receive({ payload: mockPayload });
    });
  });
});

describe('RedMobileVolumeSetNode', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  afterEach((done) => {
    helper.unload();
    helper.stopServer(done);
  });

  it('should call postRequest to set volume', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'volume-set',
        volume: 30,
        target: 'alarm',
        wires: [['n2']],
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');
      const mockPayload = { volume: 30 }; // Example payload
      const expectedJson = {
        id: 'n1',
        method: 'volume-set',
        payload: mockPayload,
        volume: 30,
        target: 'alarm',
      };

      jest
        .spyOn(util, 'postRequest')
        .mockImplementation((RED, node, msg, json) => {
          expect(json).toEqual(expectedJson);
          done();
        });

      n1.receive({ payload: mockPayload });
    });
  });

  it('should handle invalid volume input', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'volume-set',
        volume: -1,
        target: 'alarm',
        wires: [['n2']],
      },
    ];
    helper.load(testNode, flow, () => {
      const n1 = helper.getNode('n1');
      const mockPayload = { volume: -1 };

      const errorSpy = jest.spyOn(n1, 'error');

      n1.on('input', () => {
        expect(errorSpy).toHaveBeenCalled();
        const errorCallArguments = errorSpy.mock.calls[0];
        expect(errorCallArguments[0]).toBe('volume.errors.volume');
        done();
      });
      n1.receive({ payload: mockPayload });
    });
  });
});
