import type { EventEmitter } from "ws";
import type { RedNodeAPI } from "./@types/nodeAPI";
import WebSocketClient from "./WebSocketClient";

export function open(RED: RedNodeAPI, ev: EventEmitter, path: string) {
	const ws = new (WebSocketClient as any)(ev);
	const port = RED.settings.redMobileWsPort;
	if (port) {
		ws.open(`ws://localhost:${port}${path}`, RED.settings.forceClose);
	}
}
