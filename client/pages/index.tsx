import type { NextPage } from "next";
import { useSockets } from "../context/socket.context";
import RoomsContainer from "../components/Rooms";
import MessagesContainer from "../components/Messages";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import EVENTS from "../config/events";
import Nav from "../components/Nav";

interface IForm {
  username: string;
}

const Home: NextPage = () => {
  const { socket, username, setUsername, roomId, setRoomId, setRoomname } =
    useSockets();
  const { register, getValues, handleSubmit } = useForm<IForm>();
  const handleSetUsername = () => {
    const value = getValues("username");
    if (!value) {
      return;
    }
    socket.emit(EVENTS.CLIENT.LOGIN_USER, { value });
    setUsername(value);
    localStorage.setItem("username", value);
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const curRoom = localStorage.getItem("curRoom");

    if (username) setUsername(username); // 로컬에 유저이름이 있을 경우 해당 이름으로 로그인
    if (curRoom) {
      // 방에 입장한 상황에서 새로고침하면 나가지는 현상을 고침
      const curRoomInfo = JSON.parse(curRoom);
      const roomId = curRoomInfo.roomId;
      const roomname = curRoomInfo.roomname;
      socket.emit(EVENTS.CLIENT.JOIN_ROOM, {
        key: roomId,
        roomname,
        username,
        enter: false,
      });
    }
  }, []);

  return (
    <>
      {!username && (
        <form
          onSubmit={handleSubmit(handleSetUsername)}
          className="flex flex-col w-80 space-y-4 justify-center items-center min-h-full mx-auto"
        >
          <span
            className="text-gray-100 text-center uppercase text-5xl mb-2 tracking-wider
          font-bold
          "
          >
            Nomad ChatRoom
          </span>
          <input
            placeholder="Username"
            {...register("username", {
              required: true,
            })}
            autoComplete="off"
            className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800
             bg-slate-100 focus:outline-none 
            "
          />
          <input
            className=" text-gray-800 cursor-pointer text-sm w-full font-semibold bg-amber-400
             py-2 shadow-2xl rounded-lg hover:text-gray-100 hover:bg-amber-600 transition-all duration-700
             "
            type="submit"
            value="LOG IN"
          />
        </form>
      )}
      {username && !roomId && (
        <div className="text-gray-100 min-h-full max-w-5xl mx-auto p-10">
          <Nav
            username={username}
            setRoomId={setRoomId}
            setUsername={setUsername}
          />
          <RoomsContainer />
        </div>
      )}
      {username && roomId && (
        <div className="text-gray-100 min-h-full max-w-5xl pt-10 transition-all duration-500 mx-auto flex items-center">
          <Nav
            username={username}
            setRoomId={setRoomId}
            setUsername={setUsername}
          />
          <MessagesContainer />
        </div>
      )}
    </>
  );
};

export default Home;
