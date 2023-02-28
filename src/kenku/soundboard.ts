import { callKenku, KenkuRemoteConfig } from "./kenku";

export interface Soundboard {
  id: string;
  sounds: string[];
  background: string;
  title: string;
}

export interface Sound {
  id: string;
  url: string;
  title: string;
  loop: boolean;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface SoundboardPlayback {
  sounds: Array<{
    id: string;
    url: string;
    title: string;
    loop: boolean;
    volume: number;
    fadeIn: number;
    fadeOut: number;
    duration: number;
    progress: number;
  }>;
}

export interface ListSoundboardsResponse {
  soundboards: Soundboard[];
  sounds: Sound[];
}

export const listSoundboards = async (
  config: KenkuRemoteConfig
): Promise<ListSoundboardsResponse> => {
  return callKenku(config, { path: "soundboard", method: "get" });
};

export const getPlayback = async (
  config: KenkuRemoteConfig
): Promise<SoundboardPlayback> => {
  return callKenku(config, {
    path: "soundboard/playback",
    method: "get",
    body: undefined,
  });
};

export const play = async (
  config: KenkuRemoteConfig,
  id: string
): Promise<{}> => {
  return callKenku(config, {
    path: "soundboard/play",
    method: "put",
    body: {
      id,
    },
  });
};

export const stop = async (
  config: KenkuRemoteConfig,
  id: string
): Promise<{}> => {
  return callKenku(config, {
    path: "soundboard/stop",
    method: "put",
    body: {
      id,
    },
  });
};
