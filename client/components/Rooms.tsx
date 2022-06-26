import Link from "next/link";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { enterRoom } from "../utils/local";

function RoomsContainer() {
  const { socket, roomId, rooms, username } = useSockets();

  function handleJoinRoom(key: string, roomname: string) {
    if (key === roomId) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, {
      key,
      roomname,
      username,
      enter: true,
    });
    // 로컬에 현재 접속 중인 room정보 저장
    enterRoom(key, roomname);
  }

  return (
    <div>
      {Object.keys(rooms).map((key) => {
        return (
          <div key={key}>
            <button
              disabled={key === roomId}
              title={`Join ${rooms[key].name}`}
              onClick={() => handleJoinRoom(key, rooms[key].name)}
            >
              {rooms[key].name}
            </button>
          </div>
        );
      })}
      <Link href={"/createroom"}>
        <a
          className="fixed bottom-0 shadow-2xl right-0 m-10 w-16 h-16 bg-lime-300 text-gray-800 rounded-full flex justify-center 
        items-center border-transparent text-3xl hover:bg-lime-600 hover:text-gray-100 transition duration-700 cursor-pointer
        "
        >
          +
        </a>
      </Link>
    </div>
  );
}

export default RoomsContainer;
