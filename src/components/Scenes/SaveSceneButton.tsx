import { SaveRounded } from "@mui/icons-material";
import {
  Alert,
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
import { useContext, useMemo, useState } from "react";
import { addScene } from "../../scenes/scenes";
import { CampaignContext, CampaignContextType } from "../../App";

function SaveSceneButton() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const { campaign } = useContext(CampaignContext) as CampaignContextType;

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
                  setInput(event.target.value);
                }}
              />
              <Button
                sx={{ width: "25%", ml: "5%" }}
                type="submit"
                variant="contained"
                disabled={!input.trim().length || !campaign}
                onClick={async () => {
                  const playlistPlayback = await getPlaylistPlayback(
                    kenkuConfig
                  );
                  const soundboardPlayback = await getSoundboardPlayback(
                    kenkuConfig
                  );
                  try {
                    await addScene(campaign!, {
                      name: input.trim(),
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
              <Typography variant="subtitle1" sx={{ marginTop: "20px" }}>
                Current campaign: {campaign || "none selected"}
              </Typography>
            </i>
            {error && <Alert severity="error">{error}</Alert>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SaveSceneButton;
