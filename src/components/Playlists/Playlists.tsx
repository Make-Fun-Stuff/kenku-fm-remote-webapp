import { PlayArrowRounded } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { sortBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import {
  listPlaylists,
  ListPlaylistsResponse,
  Playlist,
  play,
} from "../../kenku/playlist";
import PlaylistButton from "../PlaylistButton/PlaylistButton";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export interface PlaylistsProps {
  connectionFailure: () => void;
}

const NUM_RECENT = 2;

function Playlists(props: PlaylistsProps) {
  const [loading, setLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [mostRecent, setMostRecent] = useState<Playlist[]>([]);
  const [playlists, setPlaylists] = useState<ListPlaylistsResponse>({
    playlists: [],
    tracks: [],
  });
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
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
        setPlaylists(await listPlaylists(kenkuConfig));
        setHadError(false);
      } catch (error) {
        setHadError(true);
        connectionFailure();
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [kenkuConfig, connectionFailure]);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateMostRecent = (newPlaylist: Playlist) => {
    setMostRecent([newPlaylist, ...mostRecent.slice(0, NUM_RECENT)]);
  };

  if (loading) {
    return <div />;
  }

  let itemWidth = 3;
  if (windowDimensions.width < 500) {
    itemWidth = 12;
  } else if (windowDimensions.width < 750) {
    itemWidth = 6;
  } else if (windowDimensions.width < 2000) {
    itemWidth = 4;
  }

  return hadError ? (
    <div />
  ) : (
    <div
      style={{
        marginTop: "50px",
      }}
    >
      <Typography variant="h5" marginBottom={"20px"}>
        Music
      </Typography>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        marginBottom={"30px"}
      >
        {mostRecent.slice(1).map((playlist, index) => {
          return (
            <Grid
              item
              key={index}
              xs={Math.floor(12 / NUM_RECENT)}
              alignItems="center"
              justifyContent="center"
            >
              <Button
                startIcon={<PlayArrowRounded />}
                variant="contained"
                sx={{
                  width: "90%",
                  height: "75px",
                  marginLeft: "5%",
                  marginRight: "5%",
                }}
                onClick={async () => {
                  await play(kenkuConfig, playlist.id);
                  updateMostRecent(playlist);
                }}
              >
                {playlist.title}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={2}>
        {sortBy(
          playlists.playlists,
          (_) => `${_.tracks.length ? "" : "zzz"}${_.title}`
        ).map((playlist, index) => {
          return (
            <Grid item xs={itemWidth} key={index}>
              <PlaylistButton
                playlist={playlist}
                play={async () => {
                  await play(kenkuConfig, playlist.id);
                  updateMostRecent(playlist);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default Playlists;
