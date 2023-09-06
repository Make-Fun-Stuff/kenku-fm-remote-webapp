import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { volumeDown, volumeUp, bluetoothConnect } from "../../shellApi/shell";
import {
  VolumeDownRounded,
  VolumeUpRounded,
  BluetoothAudioRounded,
} from "@mui/icons-material";

function ServerVolumeController() {
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
            <Button
              style={{ marginTop: 20 }}
              aria-label="server-bt-connect"
              variant="contained"
              onClick={() => {}}
              onDoubleClick={async (_) => {
                await bluetoothConnect();
              }}
            >
              <BluetoothAudioRounded />
              &nbsp;Connect to Bluetooth
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ServerVolumeController;
