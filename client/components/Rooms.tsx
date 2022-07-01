import Link from "next/link";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { enterRoom } from "../utils/local";

function RoomsContainer() {
  const { socket, roomId, rooms, username } = useSockets();

  function handleJoinRoom(
    key: string,
    roomname: string,
    code: string | undefined
  ) {
    if (key === roomId) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, {
      key,
      roomname,
      username,
      enter: true,
    });
    // 로컬에 현재 접속 중인 room정보 저장
    enterRoom(key, roomname, code);
    localStorage.removeItem(key);
  }

  return (
    <main className="mt-12 min-h-full">
      <span className="text-slate-700 text-3xl font-extrabold text-center uppercase mb-2 tracking-wider">
        Nomad ChatRoom LIST
      </span>
      <div className="mt-2 grid gap-3 grid-cols-phoneGrid sm:grid-cols-windowGrid">
        {Object.keys(rooms).map((key) => {
          return (
            <div
              key={key}
              onClick={() =>
                handleJoinRoom(key, rooms[key].name, rooms[key].code + "")
              }
              className=" bg-slate-100 bg-opacity-50 text-gray-600 p-3 h-40 rounded-md cursor-pointer duration-500
              flex flex-col space-y-2 justify-center items-center hover:bg-opacity-90 hover:text-gray-900 transition-all
                "
            >
              <div>{rooms[key].name}</div>
              <div>
                <div className="flex items-center space-x-1 justify-center text-sm">
                  {rooms[key].code + "" !== "undefined" ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
    </main>
  );
}

export default RoomsContainer;
