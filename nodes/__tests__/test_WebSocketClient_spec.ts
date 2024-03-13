import EventEmitter from "node:events";
import WebSocket from "ws";
import WebSocketClient from "../WebSocketClient";

jest.mock("ws");

describe("WebSocketClient", () => {
	let ev: EventEmitter;
	let client: WebSocketClient;
	let mockWebSocketInstance: jest.MockedClass<typeof WebSocket>;

	beforeEach(() => {
		ev = new EventEmitter();
		client = new WebSocketClient(ev);
		mockWebSocketInstance = WebSocket as unknown as jest.MockedClass<
			typeof WebSocket
		>;
		mockWebSocketInstance.mockClear();
	});

	it("should open a WebSocket connection", () => {
		const url = "ws://example.com";
		client.open(url);

		expect(mockWebSocketInstance).toHaveBeenCalledWith(url);
		expect(mockWebSocketInstance.prototype.on).toHaveBeenCalledWith(
			"open",
			expect.any(Function),
		);
		expect(mockWebSocketInstance.prototype.on).toHaveBeenCalledWith(
			"message",
			expect.any(Function),
		);
		expect(mockWebSocketInstance.prototype.on).toHaveBeenCalledWith(
			"close",
			expect.any(Function),
		);
		expect(mockWebSocketInstance.prototype.on).toHaveBeenCalledWith(
			"error",
			expect.any(Function),
		);
	});

	it("should send a message", () => {
		client.open("ws://example.com");
		const data = "hello";
		client.send(data);

		expect(mockWebSocketInstance.prototype.send).toHaveBeenCalledWith(data);
	});
});
