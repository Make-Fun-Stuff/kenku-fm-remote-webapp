import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { volumeDown, volumeUp } from "../../shellApi/shell";
import { VolumeDownRounded, VolumeUpRounded } from "@mui/icons-material";

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
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ServerVolumeController;
