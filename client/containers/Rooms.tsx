import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { useForm, SubmitHandler } from "react-hook-form";
import { enterRoom } from "../utils/local";

interface IForm {
  roomname: string;
}

function RoomsContainer() {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const { socket, roomId, rooms, username } = useSockets();

  const handleCreateRoom = (data: { roomname: string }) => {
    const { roomname } = data;

    // get the room name
    if (roomname === "") return;

    // emit room created event
    // emit 메서드의 arg에는 fd에서 실행될 함수를 넣을 넣을 수 있다. 단, 마지막 arg이여야 한다.
    // 이때 bd에서는 해당 함수를 실행할 권한을 부여한다.
    socket.emit(
      EVENTS.CLIENT.CREATE_ROOM,
      { roomname },
      (roomId: string, roomname: string) => {
        // 로컬에 현재 접속 중인 room정보 저장
        enterRoom(roomId, roomname);
      }
    );

    // set room name input ot empty string
    setValue("roomname", "");
  };

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
    <nav>
      <form onSubmit={handleSubmit(handleCreateRoom)}>
        <input placeholder="Room name" {...register("roomname")} />
        <input type="submit" value="CREATE ROOM" />
      </form>
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
