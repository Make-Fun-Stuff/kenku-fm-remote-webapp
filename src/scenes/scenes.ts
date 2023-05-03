import { KenkuRemoteConfig } from "../kenku/kenku";
import {
  getPlayback as getPlaylistPlayback,
  play as playPlaylist,
} from "../kenku/playlist";
import {
  getPlayback as getSoundboardPlaylist,
  play as playSoundboard,
  stop,
} from "../kenku/soundboard";

export interface NewScene {
  name: string;
  soundboardIds?: string[];
  playlistId?: string;
}

export interface Scene extends NewScene {
  id: string;
}

const port = 5003;

const getUrl = () => {
  const currentUrl = window.location.href;
  const portMatch = currentUrl.match("(:[0-9]+)");
  const url = portMatch
    ? currentUrl.slice(0, currentUrl.indexOf(portMatch[1]))
    : currentUrl;
  return `${url}:${port}`;
};

export const listScenes = async (): Promise<Scene[]> => {
  const response = await fetch(getUrl(), {
    method: "get",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 400) {
    throw Error(`Invalid response from list scenes API: ${response.status}`);
  }
  return response.json();
};

export const addScene = async (scene: NewScene) => {
  const response = await fetch(getUrl(), {
    method: "post",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scene),
  });
  if (response.status >= 400) {
    throw Error(`Invalid response from create scene API: ${response.status}`);
  }
  return response.json();
};

export const deleteScene = async (id: string) => {
  const response = await fetch(`${getUrl()}/${id}`, {
    method: "delete",
    headers: {
      "Access-Control-Allow-Origin": "*",
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 400) {
    throw Error(`Invalid response from delete scene API: ${response.status}`);
  }
  return response.json();
};

export const playScene = async (config: KenkuRemoteConfig, scene: Scene) => {
  // stop current sounds
  const soundboardPlayback = await getSoundboardPlaylist(config);
  for (const sound of soundboardPlayback.sounds.filter(
    (_) => !(scene.soundboardIds || []).includes(_.id)
  )) {
    await stop(config, sound.id);
  }

  // play playlist
  if (scene.playlistId) {
    const playlistPlayback = await getPlaylistPlayback(config);
    if (
      playlistPlayback.playlist &&
      playlistPlayback.playlist.id !== scene.playlistId
    ) {
      await playPlaylist(config, scene.playlistId);
    }
  }

  // play sounds
  if (scene.soundboardIds) {
    for (const soundId of scene.soundboardIds.filter(
      (id) => !soundboardPlayback.sounds.map((_) => _.id).includes(id)
    )) {
      await playSoundboard(config, soundId);
    }
  }
};
