import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";

interface IForm {
  password: string;
}

function DeleteRoom() {
  const { socket, roomId, setRoomId, setRoomname } = useSockets();
  const { register, handleSubmit } = useForm<IForm>({
    mode: "onChange",
  });

  const onSubmit = (data: IForm) => {
    const { password } = data;
    if (!roomId) return;
    localStorage.removeItem("curRoom");
    localStorage.removeItem(roomId);
    setRoomId(undefined);
    setRoomname(undefined);
    socket.emit(EVENTS.CLIENT.DELETE_ROOM, { password, roomId }, () => {
      console.log("비밀번호가 틀립니다.");
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("password", { required: true })}
          autoComplete="off"
          type="text"
        />
        <input type="submit" value="채팅 종료하기" />
      </form>
    </div>
  );
}

export default DeleteRoom;
