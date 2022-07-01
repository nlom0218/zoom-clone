import React, { useEffect, useState } from "react";

type GetMedia = (deviceId?: string) => void;

interface DeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
}

const Video = () => {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [myFace, setMyFace] = useState<any>();
  const [myStream, setMyStream] = useState<MediaStream>();
  const [myCameras, setMyCameras] = useState<DeviceInfo[]>();

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      const mics = devices.filter((device) => device.kind === "audioinput");
      const audios = devices.filter((device) => device.kind === "audiooutput");
      setMyCameras(cameras);
    } catch (error) {
      console.log(error);
    }
  };

  const GetMedia: GetMedia = async (deviceId) => {
    const initialConstraints = {
      audio: false,
      video: true,
    };
    const cameraConstraints = {
      audio: true,
      video: { deviceId: { exact: deviceId } },
    };
    try {
      const newMyStream = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstraints : initialConstraints
      );
      if (!deviceId) {
        await getCameras();
      }
      setMyStream(newMyStream);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    GetMedia();
    const newMyFace = document.getElementById("myFace");

    setMyFace(newMyFace);
  }, []);

  useEffect(() => {
    if (myStream) {
      if (!myFace) return;
      myFace.srcObject = myStream;
    }
  }, [myStream]);

  return (
    <div>
      <video
        id="myFace"
        className=" w-full h-full"
        autoPlay={true}
        playsInline={true}
      />
      <button onClick={onClickMute}>
        {muted ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
            className="h-6 w-6"
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
            className="h-6 w-6"
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
            className="h-6 w-6"
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
      <select onInput={onChangeMyCamera}>
        {myCameras?.map((item) => {
          return <option key={item.deviceId}>{item.label}</option>;
        })}
      </select>
      {/* <select onChange={onChangeMyAudios}>
        {myAudios?.map((item) => {
          return (
            <option key={item.deviceId} value={item.deviceId}>
              {item.label}
            </option>
          );
        })}
      </select>
      <select onChange={onChangeMyMic}>
        {myMics?.map((item) => {
          return (
            <option key={item.deviceId} value={item.deviceId}>
              {item.label}
            </option>
          );
        })}
      </select> */}
    </div>
  );
};

export default Video;
