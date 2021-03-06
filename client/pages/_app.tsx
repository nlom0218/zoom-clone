import "../styles/globals.css";
import type { AppProps } from "next/app";
import SocketsProvider from "../context/socket.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketsProvider>
      <div className=" bg-center bg-cover relative w-full min-h-screen bg-gradient-to-br font-sans bg-patteren">
        <div className="bg-slate-900 w-full min-h-screen bg-opacity-5">
          <div className=" absolute top-0 bottom-0 left-0 right-0 overflow-scroll mb-10">
            <Component {...pageProps} />
          </div>
          <div className=" fixed text-gray-100 bottom-1 left-2">
            Image from unsplash
          </div>
        </div>
      </div>
    </SocketsProvider>
  );
}

export default MyApp;
