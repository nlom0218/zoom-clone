import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import codePlaceHolder from "../utils/codePlaceHolder";
import { enterRoom } from "../utils/local";

interface IForm {
  roomname: string;
  password: string;
  [key: string]: string;
}

export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};

function CreateRoom() {
  const router = useRouter();
  const { register, setValue, handleSubmit, getValues, watch } =
    useForm<IForm>();

  const { socket } = useSockets();
  const [type, setType] = useState<"Public" | "Private">("Public");

  const onClickTypeBtn = (type: "Public" | "Private") => {
    setType(type);
  };

  const handleCreateRoom = (data: IForm) => {
    const { roomname, password, code1, code2, code3, code4, code5, code6 } =
      data;

    const code =
      type === "Public"
        ? "undefined"
        : code1 + code2 + code3 + code4 + code5 + code6;
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

  useEffect(() => {
    if (!watch("code1") || watch("code1") === "") return;
    document.getElementById(`code2`)?.focus();
  }, [watch("code1")]);
  useEffect(() => {
    if (!watch("code2") || watch("code2") === "") return;
    document.getElementById(`code3`)?.focus();
  }, [watch("code2")]);
  useEffect(() => {
    if (!watch("code3") || watch("code3") === "") return;
    document.getElementById(`code4`)?.focus();
  }, [watch("code3")]);
  useEffect(() => {
    if (!watch("code4") || watch("code4") === "") return;
    document.getElementById(`code5`)?.focus();
  }, [watch("code4")]);
  useEffect(() => {
    if (!watch("code2") || watch("code2") === "") return;
    document.getElementById(`code6`)?.focus();
  }, [watch("code5")]);

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
            <div className="w-full flex space-x-2">
              {["1", "2", "3", "4", "5", "6"].map((item) => (
                <input
                  key={item}
                  placeholder={codePlaceHolder(item)}
                  {...register(`code${item}`, {
                    required: true,
                    onChange: () => {
                      document.getElementById(`code${item + 1}`)?.focus();
                    },
                  })}
                  minLength={1}
                  maxLength={1}
                  id={`code${item}`}
                  autoComplete="off"
                  type="text"
                  className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800
              bg-slate-100 focus:outline-none text-center
              "
                />
              ))}
            </div>
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
