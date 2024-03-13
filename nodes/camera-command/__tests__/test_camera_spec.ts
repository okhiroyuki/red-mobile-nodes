jest.mock("../../util");

import helper from "node-red-node-test-helper";
import type { CustomLocalSetting } from "../../@types/util";
import * as util from "../../util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testNode = require("../camera");
const mockPostRequest = jest.spyOn(util, "postRequest");
const mockGetRequest = jest.spyOn(util, "getRequest");

helper.init(require.resolve("node-red"), {
	redMobilePort: 1880,
	redMobileAccessKey: "dummy_key",
} as CustomLocalSetting);

describe("CameraNode", () => {
	beforeEach((done) => {
		helper.startServer(done);
	});

	afterEach((done) => {
		mockPostRequest.mockClear();
		mockGetRequest.mockClear();
		helper.unload();
		helper.stopServer(done);
	});

	it("should call camera-open on input", (done) => {
		const flow = [
			{
				id: "n1",
				type: "camera-open",
				name: "test name",
				preview: "enable",
				direction: "back",
			},
		];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "camera-open",
				payload: mockPayload,
				options: {
					toBack: false,
					direction: "back",
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

	it("should call camera-open with preview disable on input", (done) => {
		const flow = [
			{
				id: "n1",
				type: "camera-open",
				name: "test name",
				preview: "disable",
				direction: "back",
			},
		];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "camera-open",
				payload: mockPayload,
				options: {
					toBack: true,
					direction: "back",
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

	it("should call camera-open with direction front on input", (done) => {
		const flow = [
			{
				id: "n1",
				type: "camera-open",
				name: "test name",
				preview: "disable",
				direction: "front",
			},
		];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "camera-open",
				payload: mockPayload,
				options: {
					toBack: true,
					direction: "front",
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

	it("should call camera-close on input", (done) => {
		const flow = [{ id: "n1", type: "camera-close" }];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "camera-close",
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

			n1.receive({ payload: mockPayload });
		});
	});

	it("should call camera-take-picture on input", (done) => {
		const flow = [{ id: "n1", type: "take-picture" }];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "camera-take-picture",
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

			n1.receive({ payload: mockPayload });
		});
	});

	it("should call camera-switch on input", (done) => {
		const flow = [{ id: "n1", type: "camera-switch" }];
		helper.load(testNode, flow, () => {
			const n1 = helper.getNode("n1");

			const mockPayload = "test payload";
			const expectedJson = {
				id: "n1",
				method: "camera-switch",
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

			n1.receive({ payload: mockPayload });
		});
	});
});
