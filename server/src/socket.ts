import { Server, Socket } from "socket.io";
import logger from "./utils/logger";
import { nanoid } from "nanoid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  console.log("Sockets enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log(`roomName: ${roomName}`);
      // create a roomId
      const roomId = nanoid();

      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      // socket.join(roomId)
      socket.join(roomId);

      // broadcast an event sayint there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
