import { Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  play,
  stop,
  getPlayback,
  listSoundboards,
  ListSoundboardsResponse,
} from "../../kenku/soundboard";
import { sortBy } from "lodash";
import SoundboardButton from "../SoundboardButton/SoundboardButton";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export interface SoundboardsProps {
  connectionFailure: () => void;
}

function Soundboards(props: SoundboardsProps) {
  const [loading, setLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [soundboards, setSoundboards] = useState<ListSoundboardsResponse>({
    soundboards: [],
    sounds: [],
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
        setSoundboards(await listSoundboards(kenkuConfig));
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

  if (loading) {
    return <div />;
  }

  let itemWidth = 2;
  if (windowDimensions.width < 500) {
    itemWidth = 12;
  } else if (windowDimensions.width < 750) {
    itemWidth = 6;
  } else if (windowDimensions.width < 1000) {
    itemWidth = 4;
  } else if (windowDimensions.width < 1700) {
    itemWidth = 3;
  }

  return hadError ? (
    <div />
  ) : (
    <div
      style={{
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <Typography variant="h5" marginBottom={"20px"}>
        Sound Effects
      </Typography>
      <Grid container spacing={2}>
        {sortBy(
          soundboards.soundboards,
          (_) => `${_.sounds.length ? "" : "zzz"}${_.title}`
        ).map((soundboard, index) => {
          return (
            <Grid item xs={itemWidth} key={index}>
              <SoundboardButton
                soundboard={soundboard}
                play={async () => {
                  const playback = await getPlayback(kenkuConfig);
                  await Promise.all(
                    playback.sounds.map((_) => stop(kenkuConfig, _.id))
                  );
                  await Promise.all(
                    soundboard.sounds.map((_) => play(kenkuConfig, _))
                  );
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default Soundboards;
