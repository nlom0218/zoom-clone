const EVENTS = {
  connection: "connection",
  CLIENT: {
    LOGIN_USER: "LOGIN_USER",
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
    RESET_ROOM: "RESET_ROOM",
    LEAVE_ROOM: "LEAVE_ROOM",
    DELETE_ROOM: "DELETE_ROOM",
    RELEASE_ROOM: "RELEASE_ROOM",
    CONNECT_PEER: "CONNECT_PEER",
    SEND_OFFER: "SEND_OFFER",
    SEND_ANSWER: "SEND_ANSWER",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOMS_MESSAGE: "ROOMS_MESSAGE",
    WELCOME_MESSAGE: "WELCOME_MESSAGE",
    RESET_ROOM: "RESET_ROOM",
    BYE_MESSAGE: "BYE_MESSAGE",
    DELETE_ROOM: "DELETE_ROOM",
    CONNECT_PEER: "CONNECT_PEER",
    SEND_OFFER: "SEND_OFFER",
    SEND_ANSWER: "SEND_ANSWER",
  },
};

export default EVENTS;
