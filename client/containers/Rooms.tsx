import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { useForm, SubmitHandler } from "react-hook-form";

interface IForm {
  roomname: string;
}

function RoomsContainer() {
  const { register, getValues, setValue } = useForm<IForm>();
  const { socket, roomId, rooms } = useSockets();
  console.log(rooms);

  const handleCreateRoom = () => {
    // get the room name
    const roomName = getValues("roomname");
    if (roomName === "") return;

    // emit room created event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    // set room name input ot empty string
    setValue("roomname", "");
  };

  function handleJoinRoom(key: string) {
    if (key === roomId) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
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
              onClick={() => handleJoinRoom(key)}
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
