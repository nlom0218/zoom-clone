import { useSockets } from "./../context/socket.context";

export const logOut = () => {};
export const enterRoom = (roomId: string, roomname: string) => {
  localStorage.setItem("curRoom", JSON.stringify({ roomId, roomname }));
};
