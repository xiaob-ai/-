import {io, Socket} from "socket.io-client";


export class WebSocketClient {
    private socket: Socket;
    private onMessageCallback?: (data: any) => void;
    private onOpenCallback?: () => void;
    private onCloseCallback?: (event: CloseEvent) => void;
    private onErrorCallback?: (error: Event) => void;

    constructor(url: string, token: string) {
        this.socket = io(url, {
            transports: ['websocket'],
            auth: { token }
        });
        this.socket.on('message', (event: any) => this.handleMessage(event));
        this.socket.on('connect', () => this.handleOpen());
        this.socket.on('disconnect', (event: any) => this.handleClose(event));
        this.socket.on('error', (error :  any) => this.handleError(error));
        this.socket.connect();
    }

    private handleMessage(event: any) {
        console.log('message', event);
    }

    private handleOpen() {
        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
    }

    private handleClose(event: any) {
        if (this.onCloseCallback) {
            this.onCloseCallback(event);
        }
    }

    private handleError(error: Event) {
        if (this.onErrorCallback) {
            this.onErrorCallback(error);
        }
    }

    public onMessage(callback: (data: any) => void) {
        this.onMessageCallback = callback;
    }

    public onOpen(callback: () => void) {
        this.onOpenCallback = callback;
    }

    public onClose(callback: (event: CloseEvent) => void) {
        this.onCloseCallback = callback;
    }

    public onError(callback: (error: Event) => void) {
        this.onErrorCallback = callback;
    }

    public send(data: any) {
        if (this.socket.connected) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket connection is not open.');
        }
    }

    public close() {
        this.socket.close();
    }
}
