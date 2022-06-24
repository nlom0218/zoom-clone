import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
};

function socket({ io }: { io: Server }) {
  console.log("Sockets enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`User connected ${socket.id}`);
  });
}

export default socket;
