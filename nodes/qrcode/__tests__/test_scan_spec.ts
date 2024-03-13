jest.mock("../../util");

import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../scan");
const mockPostRequest = jest.spyOn(util, "postRequest");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("ScanNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		mockPostRequest.mockClear();
		helper.unload();
		helper.stopServer(done);
	});

	test.each([
		{ input_camera: "back", expected_preferFrontCamera: false },
		{ input_camera: "front", expected_preferFrontCamera: true },
	])(
		"should send with camera is %s",
		({ input_camera, expected_preferFrontCamera }, done) => {
			const flow = [
				{
					id: "n1",
					type: "qrcode scan",
					camera: input_camera,
					showFlipCameraButton: true,
					showTorchButton: true,
					torchOn: true,
					orientation: "portrait",
					prompt: "test",
				},
			];
			helper.load(testNode, flow, () => {
				const n1 = helper.getNode("n1");

				const mockPayload = { message: "test message" };
				const expectedJson = {
					id: "n1",
					method: "qrcode-scan",
					payload: mockPayload,
					options: {
						preferFrontCamera: expected_preferFrontCamera,
						showFlipCameraButton: true,
						showTorchButton: true,
						torchOn: true,
						orientation: "portrait",
						prompt: "test",
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
		},
	);
});
