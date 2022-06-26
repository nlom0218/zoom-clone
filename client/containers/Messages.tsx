import { time } from "console";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { IMessage, useSockets } from "../context/socket.context";
import { saveMessage } from "../utils/local";

interface IForm {
  message: string;
}

function MessagesContainer() {
  const { register, getValues, handleSubmit, setValue } = useForm<IForm>({
    mode: "onChange",
  });
  const {
    socket,
    messages,
    roomId,
    username,
    setMessages,
    roomname,
    setRoomId,
    setRoomname,
  } = useSockets();

  const handleSendMessage = (data: { message: string }) => {
    const { message } = data;
    socket.emit(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      { roomId, message, username },
      (time: string, messageId: string) => {
        saveMessage(message, username, time, roomId, messageId);
        setMessages((prev: IMessage) => {
          if (prev.length === 0) {
            return [
              {
                username,
                message,
                time: time,
                messageId,
              },
            ];
          } else {
            return [
              ...prev,
              {
                username,
                message,
                time: time,
                messageId,
              },
            ];
          }
        });
      }
    );
    setValue("message", "");
  };

  const onClickLeaveRoom = () => {
    // 방 나가기 전 알림창 띄우기

    if (!roomId) return;
    localStorage.removeItem("curRoom");
    localStorage.removeItem(roomId);
    setRoomId(undefined);
    setRoomname(undefined);
    socket.emit(EVENTS.CLIENT.LEAVE_ROOM, { roomId, username });
  };

  const onClickRemoveAllMesg = () => {
    if (!roomId) return;
    localStorage.removeItem(roomId);
    setMessages([]);
  };

  useEffect(() => {
    const curRoom = localStorage.getItem("curRoom");

    if (!curRoom) return;

    const curRoomId = JSON.parse(curRoom).roomId;
    const localMessages = localStorage.getItem(curRoomId);
    if (!localMessages) return;

    const parseMessages = JSON.parse(localMessages);
    socket.emit(EVENTS.CLIENT.RESET_ROOM, parseMessages, curRoomId);
  }, []);

  return (
    <div>
      <h3>Welcome {roomname}</h3>
      {messages?.map(({ message, username: msgOnwer }, index) => {
        return (
          <p key={index}>
            {username === msgOnwer ? "me" : msgOnwer}:{message}
          </p>
        );
      })}

      <form onSubmit={handleSubmit(handleSendMessage)}>
        <input
          {...register("message", { required: true })}
          placeholder="Tell us what you are thinking"
          autoComplete="off"
        />
        <input type="submit" value="SEND" />
      </form>
      <button onClick={onClickLeaveRoom}>방 나가기</button>
      <button onClick={onClickRemoveAllMesg}>메시지 전체 삭제</button>
    </div>
  );
}

export default MessagesContainer;
