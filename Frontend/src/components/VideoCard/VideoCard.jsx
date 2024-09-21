import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;

  useEffect(() => {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on('track', (track, stream) => {
    });
  }, [peer]);

  return (
    <Video
    className='h-full w-full bg-black object-cover rounded-full'
      playsInline
      autoPlay
      ref={ref}
    />
  );
};

const Video = styled.video``;

export default VideoCard;
