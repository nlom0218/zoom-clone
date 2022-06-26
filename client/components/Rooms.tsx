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
      <span
        className="text-gray-100 text-center uppercase text-2xl mb-2 tracking-wider
          font-bold
          "
      >
        Nomad ChatRoom LIST
      </span>
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
          className="fixed bottom-0 shadow-2xl p-4 right-0 m-10 bg-lime-300 text-gray-800 rounded-full flex justify-center 
        items-center border-transparent text-3xl hover:bg-lime-500 hover:text-gray-100 transition duration-1000 cursor-pointer hover:rotate-[360deg] 
        "
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </a>
      </Link>
    </div>
  );
}

export default RoomsContainer;
