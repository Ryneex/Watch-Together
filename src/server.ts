import path from "path";
import express from "express";
import http from "http";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve("build/dist"), { index: false }));

app.get("/*", (_, res) => {
    if (process.env.NODE_ENV === "production") {
        return res.sendFile(path.resolve("build/dist/index.html"));
    }
    res.sendFile(path.resolve("src/html/not-production.html"));
});

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

export { app, server, io };
