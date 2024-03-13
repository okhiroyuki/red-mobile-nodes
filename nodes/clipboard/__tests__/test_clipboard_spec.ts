jest.mock("../../util");

import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../clipboard");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("ClipboardNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		helper.unload();
		helper.stopServer(done);
	});

	it("should call postRequest on input", (done) => {
		const flow = [{ id: "n1", type: "clipboard", mode: "copy" }];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPostRequest = jest.spyOn(util, "postRequest");
			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "clipboard",
				payload: mockPayload,
				options: { mode: "copy" },
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
