import type { NextPage } from "next";
import { useSockets } from "../context/socket.context";
import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import EVENTS from "../config/events";

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
    setUsername(value);
    localStorage.setItem("username", value);
  };

  const onClickLogOut = () => {
    localStorage.clear();
    setRoomId(undefined);
    setUsername(undefined);
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
    <div>
      {!username && (
        <form onSubmit={handleSubmit(handleSetUsername)}>
          <input
            placeholder="Username"
            {...register("username", {
              required: true,
            })}
            autoComplete="off"
          />
          <input type="submit" value="LOG IN" />
        </form>
      )}
      {username && (
        <>
          <div>환영합니다 {username}님^^</div>
          <button onClick={onClickLogOut}>로그아웃</button>
          {!roomId && <RoomsContainer />}
          {roomId && <MessagesContainer />}
        </>
      )}
    </div>
  );
};

export default Home;
