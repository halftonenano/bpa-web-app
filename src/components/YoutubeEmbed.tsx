'use client';

import { useEffect } from 'react';
import YouTube from 'react-youtube';

export default function YoutubeEmbed(props: typeof YouTube.defaultProps) {
  useEffect(() => {
    const el = document.getElementById('yt-player-embed');
    if (el) el.className = 'aspect-video w-full h-full';
  }, []);

  return (
    <YouTube
      {...props}
      id="yt-player-embed"
      onStateChange={(e) => console.log(e)}
    />
  );
}
