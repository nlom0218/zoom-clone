import type { NextPage } from "next";
import { useSockets } from "../context/socket.context";

const Home: NextPage = () => {
  const { socket } = useSockets();
  return (
    <div>
      WebScoket
      <div>{socket.id}</div>
    </div>
  );
};

export default Home;
