import type { NextPage } from "next";
import { useSockets } from "../context/socket.context";
import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface IForm {
  username: string;
}

const Home: NextPage = () => {
  const { socket, username, setUsername, roomId, setRoomId } = useSockets();
  const { register, getValues, setValue, handleSubmit } = useForm<IForm>();
  const handleSetUsername = () => {
    const value = getValues("username");
    if (!value) {
      return;
    }
    setUsername(value);
    localStorage.setItem("username", value);
  };

  const onClickLogOut = () => {
    localStorage.removeItem("username");
    setRoomId(undefined);
    setUsername(undefined);
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setUsername(username);
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
          <MessagesContainer />
        </>
      )}
    </div>
  );
};

export default Home;
