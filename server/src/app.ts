import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "config";
import { version } from "../package.json";
import socket from "./socket";
import { instrument } from "@socket.io/admin-ui";

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express();

const httpSever = createServer(app);

const io = new Server(httpSever, {
  cors: {
    origin: [corsOrigin, "https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

app.get("/", (_, res) =>
  res.send(`Server is up and running version ${version}`)
);

httpSever.listen(port, host, () => {
  console.log(`🚀 Server version ${version} is listening 🚀`);
  console.log(`http://${host}:${port}`);

  socket({ io });
});
