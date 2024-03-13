jest.mock("../../util");

import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../speech-to-text/speech-to-text");
const mockPostRequest = jest.spyOn(util, "postRequest");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("SpeechToTextNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		mockPostRequest.mockClear();
		helper.unload();
		helper.stopServer(done);
	});

	it("should call speech-to-text on input", (done) => {
		const flow = [
			{
				id: "n1",
				type: "speech-to-text",
				name: "test name",
			},
		];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "speech-to-text",
				payload: mockPayload,
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
