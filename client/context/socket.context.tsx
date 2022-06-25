import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import EVENTS from "../config/events";

export type IMessage = { message: string; time: string; username: string }[];

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  messages?: IMessage;
  setMessages: Function;
  roomId?: string;
  setRoomId: Function;
  rooms: {
    [index: string]: { name: string };
  };
  roomname?: string;
  setRoomname: Function;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  setMessages: () => false,
  rooms: {},
  messages: [],
  setRoomname: () => false,
  setRoomId: () => false,
});

function SocketsProvider(props: any) {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string | undefined>(undefined);
  const [rooms, setRooms] = useState({});
  const [messages, setMessages] = useState<IMessage>([]);
  const [roomname, setRoomname] = useState<string | undefined>(undefined);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, ({ roomId, roomname }) => {
    setRoomId(roomId);
    setRoomname(roomname);
    setMessages([]);
  });

  socket.on(EVENTS.SERVER.ROOMS_MESSAGE, ({ message, username, time }) => {
    if (!document.hasFocus()) {
      document.title = "New message...";
    }
    setMessages([
      ...messages,
      {
        message,
        username,
        time,
      },
    ]);
  });

  socket.on(EVENTS.SERVER.WELCOME_MESSAGE, ({ username }) => {
    //   디자인 작업할 때 알람 메시지로 만들기
    console.log(`${username}님이 입장함`);
  });

  useEffect(() => {
    window.onfocus = function () {
      document.title = "Chap App";
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        rooms,
        roomId,
        setRoomId,
        messages,
        setMessages,
        roomname,
        setRoomname,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
