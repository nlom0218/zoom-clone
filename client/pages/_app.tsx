import "../styles/globals.css";
import type { AppProps } from "next/app";
import SocketsProvider from "../context/socket.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketsProvider>
      <div className=" bg-center bg-cover w-full min-h-screen bg-gradient-to-br bg-city">
        <div className="bg-slate-900 min-h-screen bg-opacity-50 px-5 max-w-5xl mx-auto ">
          <Component {...pageProps} />
        </div>
      </div>
    </SocketsProvider>
  );
}

export default MyApp;
