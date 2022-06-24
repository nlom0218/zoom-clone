import type { NextPage } from "next";
import { useSockets } from "../context/socket.context";
import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import { useForm } from "react-hook-form";

interface IForm {
  username: string;
}

const Home: NextPage = () => {
  const { socket, username, setUsername } = useSockets();
  const { register, getValues } = useForm<IForm>();
  const handleSetUsername = () => {
    const value = getValues("username");
    if (!value) {
      return;
    }
    setUsername(value);
    localStorage.setItem("username", value);
  };
  return (
    <div>
      {!username && (
        <div>
          <input placeholder="Username" {...register("username")} />
          <button onClick={handleSetUsername}>START</button>
        </div>
      )}
      {username && (
        <>
          <RoomsContainer />
          <MessagesContainer />
        </>
      )}
    </div>
  );
};

export default Home;
