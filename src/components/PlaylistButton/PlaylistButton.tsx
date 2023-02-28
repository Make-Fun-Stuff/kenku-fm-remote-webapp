import { PlayArrowRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { getPlayback, pause, Playlist, resume } from "../../kenku/playlist";

export interface PlaylistButtonProps {
  playlist: Playlist;
  play: () => Promise<void>;
}

function PlaylistButton(props: PlaylistButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host", "port"]);
  const kenkuConfig: KenkuRemoteConfig = {
    host: cookies.host,
    port: cookies.port,
  };

  return (
    <Button
      disabled={!props.playlist.tracks.length}
      onClick={async () => {
        const playback = await getPlayback(kenkuConfig);
        // play if nothing or something different is playing
        if (!playback.playlist || playback.playlist.id !== props.playlist.id) {
          await props.play();
        } else {
          // pause or resume if currently playing
          if (playback.playing) {
            await pause(kenkuConfig);
          } else {
            await resume(kenkuConfig);
          }
        }
      }}
      style={{
        minWidth: "30ch",
        maxWidth: "30ch",
        justifyContent: "flex-start",
      }}
      variant={"contained"}
      startIcon={<PlayArrowRounded />}
    >
      {props.playlist.title}
    </Button>
  );
}

export default PlaylistButton;
