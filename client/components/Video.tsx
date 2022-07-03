import React, { useEffect, useRef, useState } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import * as webRTC from "../utils/webRTC.js";

interface DeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
}

const Video = ({ roomId }: { roomId: string | undefined }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { socket, peerConnection, setPeerConnection, setConnected, roomname } =
    useSockets();
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [myCameras, setMyCameras] = useState<DeviceInfo[]>();
  const [myStream, setMyStream] = useState<MediaStream>();

  //   //   console.log(peerConnection);

  //   //   let myStream: MediaStream;
  //   //   let peerConnection: RTCPeerConnection;

  //   const getCameras = async () => {
  //     try {
  //       const devices = await navigator.mediaDevices.enumerateDevices();
  //       const cameras = devices.filter((device) => device.kind === "videoinput");
  //       setMyCameras(cameras);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const handleIcecandidate = (data: any) => {
  //     // console.log(data);
  //   };

  //   const makeConnection = () => {
  //     const newPeerConnection = new RTCPeerConnection();
  //     setPeerConnection(newPeerConnection);

  //     // if (peerConnection) {
  //     //   console.log(peerConnection);
  //     //   peerConnection.addEventListener("icecandidate", handleIcecandidate);
  //     // }
  //   };

  const onClickMute = () => {
    if (myStream) {
      myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      setMuted((prev) => !prev);
    }
  };

  const onClickCamera = () => {
    if (myStream) {
      myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    }
    setCameraOff((prev) => !prev);
  };

  const onChangeMyCamera = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await e.target.value;
  };

  //   const getMedia = async (deviceId?: string) => {
  //     const initialConstraints = {
  //       audio: true,
  //       video: true,
  //     };

  //     const cameraConstraints = {
  //       audio: true,
  //       video: { deviceId: { exact: deviceId } },
  //     };
  //     try {
  //       const newMyStream = await navigator.mediaDevices.getUserMedia(
  //         deviceId ? cameraConstraints : initialConstraints
  //       );
  //       if (!deviceId) {
  //         await getCameras();
  //       }
  //       setMyStream(newMyStream);

  //       makeConnection();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   useEffect(() => {
  //     (async () => {
  //       await getMedia();
  //     })();
  //   }, []);

  useEffect(() => {
    if (videoRef.current && myStream) {
      videoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  //   useEffect(() => {
  //     if (peerConnection && myStream) {
  //       myStream
  //         .getTracks()
  //         .forEach((track) => peerConnection.addTrack(track, myStream));
  //     }
  //   }, [peerConnection, myStream]);

  //   useEffect(() => {
  //     if (peerConnection) {
  //       console.log("peerConnection");

  //       socket.emit(EVENTS.CLIENT.CONNECT_PEER, { roomId });
  //     }
  //   }, [peerConnection]);

  return (
    <div className="p-2 self-start">
      <div
        className=" relative"
        onMouseLeave={() => setIsHover(false)}
        onMouseEnter={() => setIsHover(true)}
      >
        <video
          id="myFace"
          className=" w-full h-full border border-transparent rounded-lg"
          autoPlay={true}
          playsInline={true}
          ref={videoRef}
        />
        {isHover && (
          <div
            className=" absolute top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-50 rounded-lg
            flex items-center justify-center flex-col space-y-2
        "
          >
            <div className=" flex space-x-2">
              <button onClick={onClickMute}>
                {muted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      clipRule="evenodd"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>
              <button onClick={onClickCamera}>
                {cameraOff ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <select
              onInput={onChangeMyCamera}
              className=" text-gray-800 px-4 py-2 rounded-md outline-none"
            >
              {myCameras?.map((item) => {
                return <option key={item.deviceId}>{item.label}</option>;
              })}
            </select>
          </div>
        )}
      </div>
      <script src="../utils/webRTC.js" />
    </div>
  );
};

export default Video;
