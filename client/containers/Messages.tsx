import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { IMessage, useSockets } from "../context/socket.context";

interface IForm {
  message: string;
}

function MessagesContainer() {
  const { register, getValues, handleSubmit, setValue } = useForm<IForm>({
    mode: "onChange",
  });
  const { socket, messages, roomId, username, setMessages, roomname } =
    useSockets();

  if (!roomId) {
    return <div />;
  }

  const date = new Date();

  const handleSendMessage = (data: { message: string }) => {
    const { message } = data;
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });
    setMessages((prev: IMessage) => {
      if (prev.length === 0) {
        return [
          {
            username,
            message,
            time: `${date.getHours()}:${date.getMinutes()}`,
          },
        ];
      } else {
        return [
          ...prev,
          {
            username,
            message,
            time: `${date.getHours()}:${date.getMinutes()}`,
          },
        ];
      }
    });
    setValue("message", "");
  };

  return (
    <div>
      <h3>Welcome {roomname}</h3>
      {messages?.map(({ message, username: msgOnwer }, index) => {
        return (
          <p key={index}>
            {username === msgOnwer ? "me" : msgOnwer}:{message}
          </p>
        );
      })}

      <form onSubmit={handleSubmit(handleSendMessage)}>
        <input
          {...register("message")}
          placeholder="Tell us what you are thinking"
        />
        <input type="submit" value="SEND" />
      </form>
    </div>
  );
}

export default MessagesContainer;
