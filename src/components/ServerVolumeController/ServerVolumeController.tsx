import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  volumeDown,
  volumeUp,
  startCasting,
  stopCasting,
} from "../../shellApi/shell";
import {
  VolumeDownRounded,
  VolumeUpRounded,
  CastConnected,
  Cast,
} from "@mui/icons-material";

function ServerVolumeController() {
  return (
    <div>
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
              <Stack
                spacing={2}
                direction="row"
                sx={{
                  marginTop: "2%",
                  marginLeft: "7%",
                }}
                alignItems="center"
              >
                <Button
                  aria-label="server-volume-down"
                  variant="contained"
                  onClick={async (_) => {
                    await volumeDown();
                  }}
                >
                  <VolumeDownRounded />
                </Button>
                <Typography variant="h5" gutterBottom>
                  Server Volume
                </Typography>
                <Button
                  aria-label="server-volume-up"
                  variant="contained"
                  onClick={async (_) => {
                    await volumeUp();
                  }}
                >
                  <VolumeUpRounded />
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
              <Stack
                spacing={2}
                direction="row"
                sx={{
                  marginTop: "3%",
                  marginLeft: "7%",
                }}
                alignItems="center"
              >
                <Button
                  aria-label="start-casting"
                  variant="contained"
                  onClick={async (_) => {
                    await startCasting();
                  }}
                >
                  <CastConnected />
                </Button>
                <Typography variant="h5" gutterBottom>
                  Cast to Sonos
                </Typography>
                <Button
                  aria-label="stop-casting"
                  variant="contained"
                  onClick={async (_) => {
                    await stopCasting();
                  }}
                >
                  <Cast />
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

export default ServerVolumeController;
