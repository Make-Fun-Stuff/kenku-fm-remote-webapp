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
const Cookie = require("js-cookie");

export interface Scene {
  name: string;
  soundboardIds?: string[];
  playlistId?: string;
}

const COOKIE_NAME = "scenes";

export const listScenes = async (): Promise<Scene[]> => {
  const cookieScenes = Cookie.get(COOKIE_NAME);
  return cookieScenes ? JSON.parse(cookieScenes) : [];
};

export const addScene = async (scene: Scene) => {
  const scenes = await listScenes();
  if (scenes.find((_) => _.name === scene.name)) {
    throw Error(`There is already a scene named '${scene.name}'`);
  }
  Cookie.set(COOKIE_NAME, JSON.stringify([...scenes, scene]));
};

export const deleteScene = async (name: string) => {
  const scenes = await listScenes();
  Cookie.set(
    COOKIE_NAME,
    JSON.stringify(scenes.filter((_) => _.name !== name))
  );
};

export const playScene = async (config: KenkuRemoteConfig, name: string) => {
  const scenes = await listScenes();
  const scene = scenes.find((_) => _.name === name);
  if (!scene) {
    throw Error(`Could not find scene with name: '${name}'`);
  }

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
