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
    const roomName = getValues("roomname");
    if (roomName === "") return;

    // emit room created event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    // set room name input ot empty string
    setValue("roomname", "");
  };
  return (
    <nav>
      <div>
        <input placeholder="Room name" {...register("roomname")} />
        <button onClick={handleCreateRoom}>CREATE ROOM</button>
      </div>
      {Object.keys(rooms).map((key) => {
        return <div key={key}>{rooms[key].name}</div>;
      })}
    </nav>
  );
}

export default RoomsContainer;
