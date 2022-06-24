import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import config from "config";
import http from "http";
import WebSocket from "ws";

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();

const httpSever = createServer(app);

const io = new Server(httpSever, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

app.get("/", (_, res) => res.send(`Server is up`));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(port, host, () => {
  console.log(`Server is listening`);
});
