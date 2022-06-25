import { IMessage, useSockets } from "./../context/socket.context";

export const logOut = () => {};
export const enterRoom = (roomId: string, roomname: string) => {
  localStorage.setItem("curRoom", JSON.stringify({ roomId, roomname }));
};

export const saveMessage = (
  message: string,
  username: string | undefined,
  time: string,
  roomId: string | undefined,
  messageId: string
) => {
  if (!roomId || !username) return;

  // 전달받은 메시지 오브젝트
  const msgObj = { message, username, time, messageId };

  // 로컬에 전달받은 메세지 저장하기
  let roomMessage: IMessage;
  let newRoomMessage;
  if (roomId) {
    const localMessage = localStorage.getItem(roomId);
    if (localMessage) {
      roomMessage = JSON.parse(localMessage);
      newRoomMessage = [...roomMessage, msgObj];
    } else {
      newRoomMessage = [msgObj];
    }
    newRoomMessage = newRoomMessage.reduce((acc, current) => {
      if (
        acc.findIndex(({ messageId }) => messageId === current.messageId) === -1
      ) {
        acc.push(current);
      }
      return acc;
    }, []);

    localStorage.setItem(roomId, JSON.stringify(newRoomMessage));
  }
};
