

export const connect = (onMessage: (message: any) => void) => {
    const socket = new WebSocket("ws://localhost:3001");
    socket.addEventListener("message", onMessage)
    return socket;
}