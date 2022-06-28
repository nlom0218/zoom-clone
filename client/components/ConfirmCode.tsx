import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSockets } from "../context/socket.context";

interface IProps {
  roomCode?: string;
  setConfirm: Function;
}

function ConfirmCode({ roomCode, setConfirm }: IProps) {
  const { setRoomId } = useSockets();
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
  const { register, handleSubmit } = useForm<{ code: string }>({
    mode: "onChange",
  });
  const onSubmit = (data: { code: string }) => {
    const { code } = data;
    if (code.length !== 6) {
      setErrMsg("6자리 숫자를 입력하세요.");
      return;
    }
    if (code === roomCode) {
      setConfirm(true);
      localStorage.setItem("confirm", "true");
    } else {
      setErrMsg("방 코드가 아닙니다.");
    }
  };
  return (
    <div className="w-full mx-auto space-y-2 flex flex-col items-center">
      <div className="text-center text-lg">
        A code is required to enter the room
      </div>
      <form
        className="flex flex-col space-y-2 w-60"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("code", {
            required: true,
            onChange: () => {
              setErrMsg(undefined);
            },
          })}
          placeholder="Room code 6 Number"
          autoComplete="off"
          type="number"
          className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800 outline-none"
        />
        <input
          type="submit"
          value="ENTER"
          className=" text-gray-800 cursor-pointer text-sm w-full font-semibold bg-amber-300
             py-2 shadow-2xl rounded-lg hover:text-gray-100 hover:bg-amber-500 transition-all duration-700
             
             "
        />
        <div
          onClick={() => {
            localStorage.removeItem("curRoom");
            setRoomId(undefined);
          }}
          className=" text-gray-800 cursor-pointer text-sm w-full font-semibold bg-red-300
             py-2 shadow-2xl rounded-lg hover:text-gray-100 hover:bg-red-500 transition-all duration-700
             text-center
             "
        >
          CANCEL
        </div>
      </form>
      {errMsg && <div>{errMsg}</div>}
    </div>
  );
}

export default ConfirmCode;
