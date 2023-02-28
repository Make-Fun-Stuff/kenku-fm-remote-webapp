import { Card, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Stop } from "@mui/icons-material";
import { getPlayback, SoundboardPlayback, stop } from "../../kenku/soundboard";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";

export interface SoundboardControllerProps {
  connectionFailure: () => void;
}

function SoundboardController(props: SoundboardControllerProps) {
  const [playback, setPlayback] = useState<SoundboardPlayback>();
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
          {!playback || !playback.sounds ? (
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Sound Effects
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
                  Sound Effects
                </Typography>
                {!playback.sounds.length ? (
                  <Typography variant="subtitle2" gutterBottom>
                    Nothing currently playing
                  </Typography>
                ) : (
                  playback.sounds.map((sound, index) => {
                    return (
                      <Typography key={index} variant="subtitle2">
                        {sound.title}
                      </Typography>
                    );
                  })
                )}
              </CardContent>
              {!!playback.sounds.length && (
                <IconButton
                  aria-label="stop"
                  onClick={async (_) => {
                    await Promise.all(
                      playback.sounds.map((_) => stop(kenkuConfig, _.id))
                    );
                  }}
                >
                  <Stop sx={{ height: 38, width: 38 }} />
                </IconButton>
              )}
            </div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

export default SoundboardController;
