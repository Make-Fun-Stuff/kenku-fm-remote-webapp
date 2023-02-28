import { callKenku, KenkuRemoteConfig } from "./kenku";

export interface Playlist {
  id: string;
  title: string;
  background: string;
  tracks: string[];
}

export interface Track {
  id: string;
  title: string;
  url: string;
}

export interface ListPlaylistsResponse {
  playlists: Playlist[];
  tracks: Track[];
}

export interface PlaylistPlayback {
  playing: boolean;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: "playlist" | "track" | "off";
  track?: {
    id: string;
    title: string;
    url: string;
    progress: number;
    duration: number;
  };
  playlist?: {
    id: string;
    title: string;
  };
}

export const listPlaylists = async (
  config: KenkuRemoteConfig
): Promise<ListPlaylistsResponse> => {
  return callKenku(config, { path: "playlist", method: "get" });
};

export const play = async (
  config: KenkuRemoteConfig,
  id: string
): Promise<any> => {
  return callKenku(config, {
    path: "playlist/play",
    method: "put",
    body: {
      id,
    },
  });
};

export const getPlayback = async (
  config: KenkuRemoteConfig
): Promise<PlaylistPlayback> => {
  return callKenku(
    config,
    { path: "playlist/playback", method: "get", body: undefined },
    true
  );
};

export const resume = async (config: KenkuRemoteConfig): Promise<{}> => {
  return callKenku(config, {
    path: "playlist/playback/play",
    method: "put",
    body: {},
  });
};

export const pause = async (config: KenkuRemoteConfig): Promise<{}> => {
  return callKenku(config, {
    path: "playlist/playback/pause",
    method: "put",
    body: {},
  });
};

export const skipToNext = async (config: KenkuRemoteConfig): Promise<{}> => {
  return callKenku(config, {
    path: "playlist/playback/next",
    method: "post",
    body: {},
  });
};

export const skipToPrevious = async (
  config: KenkuRemoteConfig
): Promise<{}> => {
  return callKenku(config, {
    path: "playlist/playback/previous",
    method: "post",
    body: {},
  });
};

export const setShuffle = async (
  config: KenkuRemoteConfig,
  shuffle: boolean
): Promise<{}> => {
  return callKenku(config, {
    path: "playlist/playback/shuffle",
    method: "put",
    body: {
      shuffle,
    },
  });
};

export const setRepeat = async (
  config: KenkuRemoteConfig,
  repeat: "track" | "playlist" | "off"
): Promise<{}> => {
  return callKenku(config, {
    path: "playlist/playback/repeat",
    method: "put",
    body: {
      repeat,
    },
  });
};
