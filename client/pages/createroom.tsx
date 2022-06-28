import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { enterRoom } from "../utils/local";

interface IForm {
  roomname: string;
  password: string;
  code: string;
}

export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};

function CreateRoom() {
  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const { socket } = useSockets();
  const [type, setType] = useState<"Public" | "Private">("Public");

  const onClickTypeBtn = (type: "Public" | "Private") => {
    setType(type);
  };

  const handleCreateRoom = (data: IForm) => {
    const { roomname, password, code } = data;
    console.log(roomname, password, code);
    // emit room created event
    // emit 메서드의 arg에는 fd에서 실행될 함수를 넣을 넣을 수 있다. 단, 마지막 arg이여야 한다.
    // 이때 bd에서는 해당 함수를 실행할 권한을 부여한다.
    socket.emit(
      EVENTS.CLIENT.CREATE_ROOM,
      { roomname, password, code },
      (roomId: string, roomname: string) => {
        // 로컬에 현재 접속 중인 room정보 저장
        enterRoom(roomId, roomname, code);
      }
    );
    router.push("/");

    // set room name input ot empty string
    setValue("roomname", "");
    setValue("password", "");
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) router.push("/");
  }, []);

  return (
    <div className="text-gray-100 min-h-screen max-w-5xl mx-auto overflow-auto p-10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleCreateRoom)}
        className="flex items-center justify-center flex-col space-y-4 w-80"
      >
        <span
          className="text-gray-100 text-center uppercase text-5xl mb-2 tracking-wider
          font-bold
          "
        >
          Create ChatRoom
        </span>
        <div className="flex w-full justify-around text-sm">
          <div
            onClick={() => onClickTypeBtn("Public")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div
              className={cls(
                "w-3 h-3 rounded-full border transition-all duration-700",
                type === "Public"
                  ? "bg-amber-300 border-amber-300"
                  : "border-gray-100"
              )}
            />
            <span>Public</span>
          </div>
          <div
            onClick={() => onClickTypeBtn("Private")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div
              className={cls(
                "w-3 h-3 rounded-full border transition-all duration-700",
                type === "Private"
                  ? "bg-amber-300 border-amber-300"
                  : "border-gray-100"
              )}
            />
            <span>Private</span>
          </div>
        </div>
        <input
          placeholder="Room name"
          {...register("roomname", { required: true })}
          autoComplete="off"
          className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800
             bg-slate-100 focus:outline-none 
            "
        />
        <div className="w-full flex flex-col justify-start space-y-1">
          <input
            placeholder="Room password"
            {...register("password", { required: true })}
            autoComplete="off"
            className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800
          bg-slate-100 focus:outline-none 
          "
          />
          <span className="text-sm text-amber-300 text-center">
            채팅방을 종료할 때 사용되는 비밀번호 입니다.
          </span>
        </div>
        {type === "Private" && (
          <div className="w-full flex flex-col justify-start space-y-1">
            <input
              placeholder="Room code 6 Number"
              {...register("code", {
                minLength: {
                  value: 6,
                  message: "놉!!!",
                },
                maxLength: {
                  value: 6,
                  message: "놉!!!",
                },
              })}
              autoComplete="off"
              type="number"
              className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800
             bg-slate-100 focus:outline-none 
            "
            />
            <span className="text-sm text-amber-300 text-center">
              코드를 입력하고 입장합니다.
            </span>
          </div>
        )}

        <input
          type="submit"
          value="CREATE ROOM"
          className=" text-gray-800 cursor-pointer text-sm w-full font-semibold bg-amber-300
             py-2 shadow-2xl rounded-lg hover:text-gray-100 hover:bg-amber-500 transition-all duration-700
             
             "
        />
        <div
          onClick={() => router.push("/")}
          className=" text-gray-800 cursor-pointer text-sm w-full font-semibold bg-red-300
             py-2 shadow-2xl rounded-lg hover:text-gray-100 hover:bg-red-500 transition-all duration-700
             text-center
             "
        >
          CANCEL
        </div>
      </form>
    </div>
  );
}
export default CreateRoom;
