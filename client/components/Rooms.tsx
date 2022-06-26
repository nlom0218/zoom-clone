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
    </div>
  );
}

export default RoomsContainer;
