jest.mock("../../util");

import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../battery/battery");
const mockGetRequest = jest.spyOn(util, "getRequest");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("BatteryNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		mockGetRequest.mockClear();
		helper.unload();
		helper.stopServer(done);
	});

	it("should call battery on input", (done) => {
		const flow = [
			{
				id: "n1",
				type: "battery",
			},
		];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const expectedJson = {
				id: "n1",
				method: "battery",
			};
			n1.on("input", () => {
				try {
					expect(mockGetRequest).toHaveBeenCalledWith(
						expect.anything(),
						n1,
						expect.anything(),
						expectedJson,
						5000,
					);
					done();
				} catch (err) {
					done(err);
				}
			});
			n1.receive({ payload: {} });
		});
	});
});
