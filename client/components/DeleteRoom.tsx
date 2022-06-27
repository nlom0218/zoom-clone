import { useState } from "react";
import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";

interface IForm {
  password: string;
}

function DeleteRoom({ setCloseMode }: { setCloseMode: Function }) {
  const { socket, roomId, setRoomId, setRoomname } = useSockets();
  const [msg, setMsg] = useState(false);
  const { register, handleSubmit } = useForm<IForm>({
    mode: "onChange",
  });

  const onClickOutBtn = () => setCloseMode(false);

  const onSubmit = (data: IForm) => {
    const { password } = data;
    if (!roomId) return;
    socket.emit(
      EVENTS.CLIENT.DELETE_ROOM,
      { password, roomId },
      (isSucess: Boolean) => {
        if (isSucess) {
          localStorage.removeItem("curRoom");
          localStorage.removeItem(roomId);
          setRoomId(undefined);
          setRoomname(undefined);
        } else {
          setMsg(true);
        }
      }
    );
  };

  return (
    <div className="fixed bg-gray-800 bg-opacity-80 right-0 left-0 top-0 bottom-0">
      <div className=" w-64 h-full flex justify-center items-center flex-col space-y-3 mx-auto">
        <div
          className=" bg-red-300 p-2 text-gray-700 rounded-full self-end hover:bg-red-600 hover:text-gray-100 transition-all duration-700 cursor-pointer"
          onClick={onClickOutBtn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className=" text-lg">Are you the owner of the room?</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3 w-full"
        >
          <input
            {...register("password", {
              required: true,
              onChange: () => {
                setMsg(false);
              },
            })}
            autoComplete="off"
            type="text"
            placeholder="Write room password"
            className=" px-4 py-1 rounded-md outline-none text-gray-800"
          />
          <input
            type="submit"
            value="CLOSE ROOM"
            className=" bg-red-300 text-gray-800 font-bold py-1 rounded-md  hover:bg-red-600 hover:text-gray-100 transition-all duration-700 cursor-pointer"
          />
        </form>
        {msg && <div className=" text-red-500 font-bold">Wrong password</div>}
      </div>
    </div>
  );
}

export default DeleteRoom;
