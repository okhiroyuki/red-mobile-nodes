import os from "node:os";
import WebSocket, { type CloseEvent, type EventEmitter } from "ws";

export default class WebSocketClient {
	private autoReconnectInterval = 5 * 1000; // ms
	private ev: EventEmitter;
	private url?: string;
	private instance?: WebSocket;

	constructor(ev: EventEmitter) {
		this.ev = ev;
	}

	open(url: string, forceClose?: boolean) {
		this.url = url;
		this.instance = new WebSocket(this.url);
		this.instance.on("open", () => {
			this.onopen();
		});
		this.instance.on("message", (data: string) => {
			this.onmessage(data);
		});

		this.instance.on("close", (e: CloseEvent) => {
			if (forceClose) return;
			if (e.code === 1000) {
				console.log("WebSocket: closed");
			} else {
				this.reconnect(e);
			}
			this.onclose();
		});

		this.instance.on("error", (e: CloseEvent) => {
			if (e.code === os.constants.errno.ECONNREFUSED) {
				this.reconnect(e);
			} else {
				this.onerror(e);
			}
		});
	}

	send(data: string) {
		try {
			this.instance?.send(data);
		} catch (e) {
			this.instance?.emit("error", e);
		}
	}

	private reconnect(e: CloseEvent) {
		console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
		this.instance?.removeAllListeners();
		setTimeout(() => {
			if (this.url) this.open(this.url);
		}, this.autoReconnectInterval);
	}

	private onopen() {
		this.ev.emit("open");
	}

	private onmessage(data: string) {
		this.ev.emit("message", data);
	}

	private onerror(e: CloseEvent) {
		this.ev.emit("error", e);
	}

	private onclose() {
		this.ev.emit("close");
	}
}
