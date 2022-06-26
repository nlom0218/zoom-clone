import "../styles/globals.css";
import type { AppProps } from "next/app";
import SocketsProvider from "../context/socket.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketsProvider>
      <div className=" max-w-5x mx-auto bg-center bg-cover w-full min-h-screen bg-gradient-to-br flex justify-center items-center bg-city px-3">
        <Component {...pageProps} />
      </div>
    </SocketsProvider>
  );
}

export default MyApp;
