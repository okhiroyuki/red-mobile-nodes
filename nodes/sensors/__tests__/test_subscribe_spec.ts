jest.mock("../../util");

import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../subscribe/subscribe");
const mockPostRequest = jest.spyOn(util, "postRequest");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("SubscribeNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		mockPostRequest.mockClear();
		helper.unload();
		helper.stopServer(done);
	});

	it("should call subscribe on input", (done) => {
		const flow = [
			{
				id: "n1",
				type: "sensor subscribe",
				freq: 3000,
				sensor: "motion",
			},
		];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = { message: "test message" };
			const expectedJson = {
				id: "n1",
				method: "sensor-subscribe",
				payload: mockPayload,
				options: {
					freq: 3000,
					sensor: "motion",
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
});
