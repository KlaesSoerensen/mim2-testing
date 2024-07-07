console.log("Starting bun socket server")

let nextUserID = 0;

const server = Bun.serve<{ userId: number }>({
    port: 3001,
    fetch(req, server) {
        const upgradeHeader = req.headers.get("Upgrade");
        if (upgradeHeader && upgradeHeader.toLowerCase() === "websocket") {
            console.log(`upgrade!`);
            const success = server.upgrade(req, { data: { userId: nextUserID++ } });
            return success
                ? undefined
                : new Response("Yall done fucky-wucky in it. (WebSocket upgrade error)", { status: 400 });
        }
        return new Response("Not a WebSocket request", { status: 400 });
    },
    websocket: {
      open(ws) {
        const msg = `${ws.data.userId} has entered`;
        ws.subscribe("global");
        server.publish("global", msg);
      },
      message(ws, message) {
        // this is a group chat
        // so the server re-broadcasts incoming message to everyone
        server.publish("global", `${ws.data.userId}: ${message}`);
      },
      close(ws) {
        const msg = `${ws.data.userId} has left`;
        ws.unsubscribe("global");
        server.publish("global", msg);
      },
    },
  });
  
  console.log(`Listening on ${server.hostname}:${server.port}`);