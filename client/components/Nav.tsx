interface IProps {
  username: string;
  setRoomId: Function;
  setUsername: Function;
}

function Nav({ username, setRoomId, setUsername }: IProps) {
  const onClickLogOut = () => {
    localStorage.clear();
    setRoomId(undefined);
    setUsername(undefined);
  };
  return (
    <nav className="p-10 fixed top-0 right-0 flex items-end space-x-2">
      <div className="flex items-center space-x-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <div>{username}</div>
      </div>
      <button
        onClick={onClickLogOut}
        className="  cursor-pointer font-semibold p-2
              shadow-2xl rounded-full text-gray-800 bg-yellow-300 transition-all duration-1000
               hover:rotate-[360deg] 
             "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </nav>
  );
}

export default Nav;
