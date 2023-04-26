import { SaveRounded } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { getPlayback as getPlaylistPlayback } from "../../kenku/playlist";
import { getPlayback as getSoundboardPlayback } from "../../kenku/soundboard";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { useMemo, useState } from "react";
import { addScene } from "../../scenes/scenes";

function SaveSceneButton() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host", "port"]);
  const kenkuConfig: KenkuRemoteConfig = useMemo(
    () => ({
      host: cookies.host,
      port: cookies.port,
    }),
    [cookies]
  );

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
          <CardContent>
            <Grid container={true}>
              <TextField
                value={input}
                sx={{ width: "70%" }}
                label="Scene Name"
                onChange={(event) => {
                  setInput(event.target.value.trim());
                }}
              />
              <Button
                sx={{ width: "25%", ml: "5%" }}
                type="submit"
                variant="contained"
                disabled={!input.trim().length}
                onClick={async () => {
                  const playlistPlayback = await getPlaylistPlayback(
                    kenkuConfig
                  );
                  const soundboardPlayback = await getSoundboardPlayback(
                    kenkuConfig
                  );
                  try {
                    await addScene({
                      name: input,
                      playlistId: playlistPlayback.playlist
                        ? playlistPlayback.playlist.id
                        : undefined,
                      soundboardIds: soundboardPlayback.sounds.map((_) => _.id),
                    });
                    setInput("");
                    setError(undefined);
                  } catch (error) {
                    setError(
                      error instanceof Error
                        ? error.message
                        : "Unexpected Error"
                    );
                  }
                }}
                startIcon={<SaveRounded />}
              >
                Save
              </Button>
            </Grid>
            <i>
              <Typography variant="subtitle1">{error}</Typography>
            </i>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SaveSceneButton;
