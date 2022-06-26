import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import { useForm } from "react-hook-form";
import { enterRoom } from "../utils/local";

interface IForm {
  roomname: string;
  password: string;
  code: string;
}

function RoomsContainer() {
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const { socket, roomId, rooms, username } = useSockets();

  const handleCreateRoom = (data: IForm) => {
    const { roomname, password, code } = data;

    // get the room name
    if (roomname === "") return;

    // emit room created event
    // emit 메서드의 arg에는 fd에서 실행될 함수를 넣을 넣을 수 있다. 단, 마지막 arg이여야 한다.
    // 이때 bd에서는 해당 함수를 실행할 권한을 부여한다.
    socket.emit(
      EVENTS.CLIENT.CREATE_ROOM,
      { roomname, password, code },
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
    <div>
      <form onSubmit={handleSubmit(handleCreateRoom)}>
        <input
          placeholder="Room name"
          {...register("roomname", { required: true })}
          autoComplete="off"
        />
        <br />
        <input
          placeholder="Room code"
          {...register("code", {
            minLength: {
              value: 6,
              message: "놉!!!",
            },
            maxLength: {
              value: 6,
              message: "놉!!!",
            },
          })}
          autoComplete="off"
          type="number"
        />
        <span>
          코드를 설정하면 해당 코드를 알고 있는 사용자만 입장가능합니다.
          필수값아님 6자리 숫자
        </span>
        <br />
        <input
          placeholder="Room password"
          {...register("password", { required: true })}
          autoComplete="off"
        />
        <span>채팅방을 제거할 때 사용되는 비밀번호 입니다.</span>
        <br />
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
    </div>
  );
}

export default RoomsContainer;
