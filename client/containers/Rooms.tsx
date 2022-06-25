import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { useForm, SubmitHandler } from "react-hook-form";

interface IForm {
  roomname: string;
}

function RoomsContainer() {
  const { register, getValues, setValue } = useForm<IForm>();
  const { socket, roomId, rooms } = useSockets();

  const handleCreateRoom = () => {
    // get the room name
    const roomname = getValues("roomname");
    if (roomname === "") return;

    // emit room created event
    // emit 메서드의 arg에는 fd에서 실행될 함수를 넣을 넣을 수 있다. 단, 마지막 arg이여야 한다.
    // 이때 bd에서는 해당 함수를 실행할 권한을 부여한다.
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomname });

    // set room name input ot empty string
    setValue("roomname", "");
  };

  function handleJoinRoom(key: string, roomname: string) {
    if (key === roomId) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, { key, roomname });
  }

  return (
    <nav>
      <div>
        <input placeholder="Room name" {...register("roomname")} />
        <button onClick={handleCreateRoom}>CREATE ROOM</button>
      </div>
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
    </nav>
  );
}

export default RoomsContainer;
