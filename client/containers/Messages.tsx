import { useForm } from "react-hook-form";
import EVENTS from "../config/events";
import { IMessage, useSockets } from "../context/socket.context";

interface IForm {
  message: string;
}

function MessagesContainer() {
  const { register, getValues, handleSubmit } = useForm<IForm>({
    mode: "onChange",
  });
  const { socket, messages, roomId, username, setMessages, roomname } =
    useSockets();

  if (!roomId) {
    return <div />;
  }

  const date = new Date();

  const handleSendMessage = () => {
    const message = getValues("message");
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
  };

  return (
    <div>
      <h3>Welcome {roomname}</h3>
      {messages?.map(({ message }, index) => {
        return <p key={index}>{message}</p>;
      })}

      <form onSubmit={handleSubmit(handleSendMessage)}>
        <textarea
          {...register("message")}
          placeholder="Tell us what you are thinking"
          rows={1}
        />
        <input type="submit" value="SEND" />
      </form>
    </div>
  );
}

export default MessagesContainer;
