import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  getPlayback,
  pause,
  PlaylistPlayback,
  resume,
  setRepeat,
  setShuffle,
  skipToNext,
  skipToPrevious,
} from "../../kenku/playlist";
import {
  Repeat,
  RepeatOn,
  RepeatOneOn,
  Shuffle,
  ShuffleOn,
} from "@mui/icons-material";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { useCookies } from "react-cookie";

export interface PlaylistControllerProps {
  connectionFailure: () => void;
}

function PlaylistController(props: PlaylistControllerProps) {
  const [playback, setPlayback] = useState<PlaylistPlayback>();
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host", "port"]);
  const kenkuConfig: KenkuRemoteConfig = useMemo(
    () => ({
      host: cookies.host,
      port: cookies.port,
    }),
    [cookies]
  );

  const connectionFailure = props.connectionFailure;

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setPlayback(await getPlayback(kenkuConfig));
        setShowError(false);
      } catch (error) {
        setShowError(true);
        connectionFailure();
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [kenkuConfig, connectionFailure]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ marginTop: "20px" }}
    >
      <Grid item xs={3}>
        <Card sx={{ minWidth: 400 }} raised={true}>
          {!playback || !playback.track ? (
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Playlist
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                {loading ? (
                  <div />
                ) : showError ? (
                  "Unable to reach kenku.fm"
                ) : (
                  "Nothing currently playing"
                )}
              </Typography>
            </CardContent>
          ) : (
            <div>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {playback.playlist && playback.playlist.title}
                </Typography>
                <Typography variant="body1">
                  {playback.track && playback.track.title}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.round(
                    (playback.track.progress / playback.track.duration) * 100
                  )}
                />
              </CardContent>
              <Box sx={{ alignItems: "center", pl: 1, pb: 1 }}>
                <IconButton
                  aria-label="shuffle"
                  onClick={async (_) => {
                    await setShuffle(kenkuConfig, !playback.shuffle);
                  }}
                >
                  {playback.shuffle ? <ShuffleOn /> : <Shuffle />}
                </IconButton>
                <IconButton
                  aria-label="previous"
                  onClick={async (_) => {
                    await skipToPrevious(kenkuConfig);
                  }}
                >
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton
                  aria-label="play/pause"
                  onClick={async (_) => {
                    playback.playing
                      ? await pause(kenkuConfig)
                      : await resume(kenkuConfig);
                  }}
                >
                  {playback.playing ? (
                    <PauseIcon sx={{ height: 38, width: 38 }} />
                  ) : (
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                  )}
                </IconButton>
                <IconButton
                  aria-label="next"
                  onClick={async (_) => {
                    await skipToNext(kenkuConfig);
                  }}
                >
                  <SkipNextIcon />
                </IconButton>
                <IconButton
                  aria-label="repeat"
                  onClick={async (_) => {
                    if (playback.repeat === "playlist") {
                      await setRepeat(kenkuConfig, "track");
                    } else if (playback.repeat === "track") {
                      await setRepeat(kenkuConfig, "off");
                    } else {
                      await setRepeat(kenkuConfig, "playlist");
                    }
                  }}
                >
                  {playback.repeat === "playlist" ? (
                    <RepeatOn />
                  ) : playback.repeat === "track" ? (
                    <RepeatOneOn />
                  ) : (
                    <Repeat />
                  )}
                </IconButton>
              </Box>
            </div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

export default PlaylistController;
