import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { IMessage, useSockets } from "../context/socket.context";
import { cls } from "../pages/createroom";
import { saveMessage } from "../utils/local";
import ConfirmCode from "./ConfirmCode";
import DeleteRoom from "./DeleteRoom";

interface IForm {
  message: string;
}

interface IRoom {
  roomId: string;
  roomname: string;
  code: string;
}

function MessagesContainer() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [confirm, setConfirm] = useState(false);
  const [thisRoom, setThisRoom] = useState<IRoom>();
  const [closeMode, setCloseMode] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>({
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
    relaseRoom,
    setRelaseRoom,
  } = useSockets();

  const onCLickCloseMode = () => {
    setCloseMode(true);
  };

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
    localStorage.removeItem("confirm");
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
    const parseCurRoom = JSON.parse(curRoom);
    setThisRoom(parseCurRoom);
    const curRoomId = JSON.parse(curRoom).roomId;
    const curRoomCode = JSON.parse(curRoom).code;

    if (curRoomCode === "undefined") {
      setConfirm(true);
    }

    const localMessages = localStorage.getItem(curRoomId);
    if (!localMessages) return;

    const parseMessages = JSON.parse(localMessages);
    socket.emit(EVENTS.CLIENT.RESET_ROOM, parseMessages, curRoomId);
  }, []);

  useEffect(() => {
    const isConfirm = localStorage.getItem("confirm");
    if (isConfirm) {
      setConfirm(true);
    }
  }, []);

  useEffect(() => {
    if (relaseRoom === roomId) {
      window.alert("채팅방이 삭제되었습니다.");
      socket.emit(EVENTS.CLIENT.RELEASE_ROOM, { roomId });
      if (!roomId) return;
      localStorage.removeItem("curRoom");
      localStorage.removeItem(roomId);
      setRoomId(undefined);
      setRoomname(undefined);
      setRelaseRoom(undefined);
    }
  }, [relaseRoom]);

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  if (!confirm) {
    return <ConfirmCode roomCode={thisRoom?.code} setConfirm={setConfirm} />;
  }

  return (
    <div
      className=" w-full mx-auto min-h-[520px] max-h-[520px]
    grid grid-rows-chatGrid
    "
    >
      <h3
        className="text-gray-100 text-2xl mb-2 tracking-wider
          font-bold
          "
      >
        WELCOME {roomname}
      </h3>
      <div className=" overflow-scroll bg-blue-100 bg-opacity-90 rounded-t-md space-y-2 p-4">
        {messages?.map(({ message, username: msgOnwer, time }, index) => {
          return time === "enter" || time === "exit" ? (
            <div key={index} className=" text-gray-700 text-sm text-center">
              {message}
            </div>
          ) : (
            <div
              key={index}
              className={cls(
                "text-gray-800 text-sm flex flex-col",
                username === msgOnwer ? "items-end" : "items-start"
              )}
            >
              <div>{username !== msgOnwer && msgOnwer}</div>
              <div className="flex items-end space-x-1">
                {username === msgOnwer && (
                  <div className=" text-xs text-gray-600">{time}</div>
                )}
                <span
                  className={cls(
                    " px-4 py-1 rounded-xl",
                    username === msgOnwer
                      ? "rounded-tr-none bg-amber-300"
                      : "rounded-tl-none bg-white"
                  )}
                >
                  {message}
                </span>
                {username !== msgOnwer && (
                  <div className=" text-xs text-gray-600">{time}</div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} className="none" />
      </div>
      <div className="bg-slate-100 text-gray-700 flex justify-end space-x-2 p-2 border-t border-gray-300">
        <button onClick={onClickLeaveRoom}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
            />
          </svg>
        </button>
        <button onClick={onClickRemoveAllMesg}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
      <form
        onSubmit={handleSubmit(handleSendMessage)}
        className=" flex w-full text-sm border-t border-gray-300"
      >
        <input
          {...register("message", { required: true })}
          placeholder="Send Message"
          autoComplete="off"
          className="w-full bg-slate-50 outline-none px-4 py-2 text-gray-800 rounded-bl-md"
        />
        <button
          type="submit"
          value="SEND"
          className="text-gray-600 border-l px-4 py-2 border-gray-300 bg-slate-100 rounded-br-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </form>
      <div
        onClick={onCLickCloseMode}
        className="fixed right-5 bottom-5 bg-red-300 px-4 py-2 text-gray-800 rounded-lg font-bold
        hover:bg-red-600 hover:text-gray-100 transition-all duration-700 cursor-pointer text-sm
      "
      >
        DELETE ROOM
      </div>
      {closeMode && <DeleteRoom setCloseMode={setCloseMode} />}
    </div>
  );
}

export default MessagesContainer;
