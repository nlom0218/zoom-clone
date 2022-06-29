import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSockets } from "../context/socket.context";
import codePlaceHolder from "../utils/codePlaceHolder";

interface IProps {
  roomCode?: string;
  setConfirm: Function;
}

function ConfirmCode({ roomCode, setConfirm }: IProps) {
  const { setRoomId } = useSockets();
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined);
  const { register, handleSubmit, watch } = useForm<{ [key: string]: string }>({
    mode: "onChange",
  });
  const onSubmit = (data: { [key: string]: string }) => {
    const { code1, code2, code3, code4, code5, code6 } = data;
    const code = code1 + code2 + code3 + code4 + code5 + code6;
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
  useEffect(() => {
    if (!watch("code1") || watch("code1") === "") return;
    document.getElementById(`code2`)?.focus();
  }, [watch("code1")]);
  useEffect(() => {
    if (!watch("code2") || watch("code2") === "") return;
    document.getElementById(`code3`)?.focus();
  }, [watch("code2")]);
  useEffect(() => {
    if (!watch("code3") || watch("code3") === "") return;
    document.getElementById(`code4`)?.focus();
  }, [watch("code3")]);
  useEffect(() => {
    if (!watch("code4") || watch("code4") === "") return;
    document.getElementById(`code5`)?.focus();
  }, [watch("code4")]);
  useEffect(() => {
    if (!watch("code2") || watch("code2") === "") return;
    document.getElementById(`code6`)?.focus();
  }, [watch("code5")]);
  return (
    <div className="w-full mx-auto space-y-2 flex flex-col items-center">
      <div className="text-center text-lg">
        A code is required to enter the room
      </div>
      <form
        className="flex flex-col space-y-2 w-72"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full flex space-x-2">
          {["1", "2", "3", "4", "5", "6"].map((item) => (
            <input
              key={item}
              placeholder={codePlaceHolder(item)}
              {...register(`code${item}`, {
                required: true,
                onChange: () => {
                  document.getElementById(`code${item + 1}`)?.focus();
                },
              })}
              minLength={1}
              maxLength={1}
              id={`code${item}`}
              autoComplete="off"
              type="text"
              className=" px-4 py-2 w-full shadow-2xl rounded-lg placeholder:text-gray-400 text-gray-800
              bg-slate-100 focus:outline-none text-center
              "
            />
          ))}
        </div>
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
