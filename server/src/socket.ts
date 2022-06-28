import { Server, Socket } from "socket.io";
import { nanoid } from "nanoid";
import { instrument } from "@socket.io/admin-ui";

interface IRoom {
  [index: string]: { name: string; password: string; code: number };
}

const EVENTS = {
  USER_NAME: "username",
  connection: "connection",
  CLIENT: {
    LOGIN_USER: "LOGIN_USER",
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
    RESET_ROOM: "RESET_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    DELETE_ROOM: "DELETE_ROOM",
    RELEASE_ROOM: "RELEASE_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOMS_MESSAGE: "ROOMS_MESSAGE",
    WELCOME_MESSAGE: "WELCOME_MESSAGE",
    RESET_ROOM: "RESET_ROOM",
    BYE_MESSAGE: "BYE_MESSAGE",
    DELETE_ROOM: "DELETE_ROOM",
  },
};

const rooms: Record<string, { name: string; password: string; code: number }> =
  {};

function socket({ io }: { io: Server }) {
  io.on(EVENTS.connection, (socket: Socket) => {
    // console.log(`User connected ${socket.id}`);
    socket.onAny((event) => {
      //   console.log(io.sockets.adapter);
    });

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     *   When a user login
     */
    // socket.on(EVENTS.CLIENT.LOGIN_USER, ({value}) => {

    // });

    /*
     *   When a user creates a new room
     */
    socket.on(
      EVENTS.CLIENT.CREATE_ROOM,
      ({ roomname, password, code }, done) => {
        // create a roomId
        const roomId = nanoid();

        // send roomId info to front-end
        done(roomId, roomname);

        // add a new room to the rooms object
        rooms[roomId] = {
          name: roomname,
          password,
          code,
        };

        // socket.join(roomId)
        socket.join(roomId);

        // broadcast an event saying there is a new room
        socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

        // emit back to the room creator with all the rooms
        socket.emit(EVENTS.SERVER.ROOMS, rooms);

        // emit event back the room creator saying they have joined a room
        socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, roomname });
      }
    );

    /*
     *   When a user sends a room message
     */
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }, done) => {
        const messageId = Date.now() + "";
        const date = new Date();
        const time = `${date.getHours()}:${date.getMinutes()}`;
        done(time, messageId);
        socket.to(roomId).emit(EVENTS.SERVER.ROOMS_MESSAGE, {
          message,
          username,
          time,
          messageId,
          roomId,
        });
      }
    );

    /*
     *   When a user joins a room
     */
    socket.on(
      EVENTS.CLIENT.JOIN_ROOM,
      ({ key: roomId, roomname, username, enter }) => {
        const messageId = Date.now() + "";
        socket.join(roomId);
        if (enter)
          socket.to(roomId).emit(EVENTS.SERVER.WELCOME_MESSAGE, {
            username,
            roomId,
            messageId,
          });
        socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, roomname });
      }
    );

    socket.on(EVENTS.CLIENT.RESET_ROOM, (parseMessages, curRoomId) => {
      socket.join(curRoomId);
      socket.emit(EVENTS.SERVER.RESET_ROOM, parseMessages);
    });

    /*
     *   When a user leaves a room
     */
    socket.on(EVENTS.CLIENT.LEAVE_ROOM, ({ roomId, username }) => {
      const messageId = Date.now() + "";
      socket.leave(roomId);
      socket
        .to(roomId)
        .emit(EVENTS.SERVER.BYE_MESSAGE, { username, roomId, messageId });
    });

    /*
     *   When delete chat room
     */
    socket.on(EVENTS.CLIENT.DELETE_ROOM, ({ password, roomId }, done) => {
      const roomPassword = rooms[roomId].password;
      if (roomPassword === password) {
        // 채팅 종료
        done(true);

        // 해당 아이디를 가진 room 제거
        delete rooms[roomId];

        socket.leave(roomId);

        socket.broadcast.emit(EVENTS.SERVER.DELETE_ROOM, { rooms, roomId });
        socket.emit(EVENTS.SERVER.DELETE_ROOM, { rooms, roomId });
      } else {
        // 비밀번호 확인 메시지 보내기
        done(false);
      }
    });

    /*
     *   When release chat room
     */
    socket.on(EVENTS.CLIENT.RELEASE_ROOM, ({ roomId }) => {
      socket.leave(roomId);
    });
  });
}

export default socket;
