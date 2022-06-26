import "../styles/globals.css";
import type { AppProps } from "next/app";
import SocketsProvider from "../context/socket.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketsProvider>
      <div className=" bg-slate-900">
        <Component {...pageProps} />
      </div>
    </SocketsProvider>
  );
}

export default MyApp;
