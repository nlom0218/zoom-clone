import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOMS_MESSAGE: "ROOMS_MESSAGE",
    WELCOME_MESSAGE: "WELCOME_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  io.on(EVENTS.connection, (socket: Socket) => {
    // console.log(`User connected ${socket.id}`);

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     *   When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomname }, done) => {
      // create a roomId
      const roomId = nanoid();

      // send roomId info to front-end
      done(roomId, roomname);

      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomname,
      };

      // socket.join(roomId)
      socket.join(roomId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, roomname });
    });

    /*
     *   When a user sends a room message
     */
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();
        socket.to(roomId).emit(EVENTS.SERVER.ROOMS_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    /*
     *   When a user joins a room
     */
    socket.on(
      EVENTS.CLIENT.JOIN_ROOM,
      ({ key: roomId, roomname, username }) => {
        socket.join(roomId);
        socket.to(roomId).emit(EVENTS.SERVER.WELCOME_MESSAGE, { username });
        socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, roomname });
      }
    );
  });
}

export default socket;
