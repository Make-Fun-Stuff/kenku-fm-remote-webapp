import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Stop } from "@mui/icons-material";
import { getPlayback, SoundboardPlayback, stop } from "../../kenku/soundboard";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { sortBy } from "lodash";

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
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="active-sounds-table">
                    <TableBody>
                      {sortBy(playback.sounds, (_) => _.title).map(
                        (sound, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {sound.title.toUpperCase()}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              <IconButton
                                onClick={async () => {
                                  await stop(kenkuConfig, sound.id);
                                }}
                              >
                                <Stop />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
              {!!playback.sounds.length && (
                <Button
                  aria-label="stop-all"
                  size="large"
                  color="error"
                  variant="contained"
                  sx={{ marginBottom: "10px" }}
                  onClick={async (_) => {
                    await Promise.all(
                      playback.sounds.map((_) => stop(kenkuConfig, _.id))
                    );
                  }}
                  startIcon={<Stop />}
                >
                  Stop All
                </Button>
              )}
            </div>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

export default SoundboardController;
