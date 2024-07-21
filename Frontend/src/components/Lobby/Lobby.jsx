import React, { useEffect } from "react";
import "./Lobby.css";
import {
  LocalVideoTrack,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useRemoteUsers,
  useJoin,
  useRemoteAudioTracks,
  usePublish,
} from "agora-rtc-react";

function Lobby({ channelName, AppId, token }) {
  console.log("Initializing Agora with:", { channelName, AppId, token });

  const remoteUsers = useRemoteUsers();
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const {data, isLoading, isConnected, error } = useJoin({
    appid: AppId,
    channel: channelName,
    token: token || null,
  });

  

  usePublish([localMicrophoneTrack, localCameraTrack]);

  useEffect(() => {
    if (localCameraTrack) {
      localCameraTrack.play("local-user");
    }
    return () => {
      if (localCameraTrack) {
        localCameraTrack.stop();
      }
    };
  }, [localCameraTrack]);

  useEffect(() => {
    remoteUsers.forEach((user) => {
      if (user.videoTrack) {
        user.videoTrack.play(`remote-user-${user.uid}`);
      }
    });
  }, [remoteUsers]);

  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  audioTracks.forEach((track) => track.play());

  const deviceLoading = isLoadingCam || isLoadingMic;

  console.log({ data, isLoading, isConnected, error });

  return (
    <div id="user_container" className="flex flex-wrap w-full h-full justify-center content-center">
      {deviceLoading ? (
        <p>Loading Device...</p>
      ) : (
        <div id="local-user" className="w-48 h-48 border-2 border-gray-700 rounded flex items-center justify-center">
          
        </div>
      )}
      
      {remoteUsers.map((user) => (
        <div
          key={user.uid}
          id={`remote-user-${user.uid}`}
          className="w-48 h-48 border-2 border-gray-700 rounded flex items-center justify-center"
        >
        
        </div>
      ))}
    </div>
  );
}

export default Lobby;
