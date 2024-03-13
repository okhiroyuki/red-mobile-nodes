jest.mock("../../util");
jest.mock("../common", () => ({
	generateBleOptions: jest.fn().mockImplementation(() => {
		return {
			address: "1234",
			service: "45",
			characteristic: "67",
		};
	}),
}));

import { Buffer } from "node:buffer";
import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../06-write");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("BleScanNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		helper.unload();
		helper.stopServer(done);
	});

	it("should call postRequest on input", (done) => {
		const flow = [{ id: "n1", type: "ble write", device: "bledevice" }];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPostRequest = jest.spyOn(util, "postRequest");
			const mockPayload = Buffer.from("test payload").toString("base64");
			const expectedJson = {
				id: "n1",
				method: "ble-write",
				payload: mockPayload,
				options: {
					address: "1234",
					service: "45",
					characteristic: "67",
				},
			};

			n1.on("input", () => {
				try {
					expect(mockPostRequest).toHaveBeenCalledWith(
						expect.anything(),
						n1,
						expect.anything(),
						expectedJson,
					);
					done();
				} catch (err) {
					done(err);
				}
			});

			n1.receive({ payload: mockPayload });
		});
	});

	it.each([
		{ input_payload: 1 },
		{ input_payload: true },
		{ input_payload: "1342234" },
	])("should error on non-base64 payloads", ({ input_payload }, done) => {
		const flow = [{ id: "n1", type: "ble write", device: "bledevice" }];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = input_payload;

			const errorSpy = jest.spyOn(n1, "error");

			n1.on("input", () => {
				expect(errorSpy).toHaveBeenCalled();
				const errorCallArguments = errorSpy.mock.calls[0];
				expect(errorCallArguments[0]).toBe(
					"msg.payload must Base64 encoded string",
				);
				done();
			});

			n1.receive({ payload: mockPayload });
		});
	});
});
