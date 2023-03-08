import { RestartAltRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { checkRestartAvailable, restart } from "../../restart/restart";

function RestartButton() {
  const [restartApiActive, setRestartApiActive] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host"]);

  useEffect(() => {
    const checkAvailable = async () => {
      try {
        setRestartApiActive(await checkRestartAvailable());
      } catch {}
    };

    checkAvailable().catch(console.error);
  }, []);

  return !restartApiActive ? (
    <div />
  ) : (
    <Button
      type="submit"
      fullWidth
      color="error"
      variant="contained"
      sx={{ mt: 2, mb: 5 }}
      onClick={async () => {
        await restart();
      }}
      startIcon={<RestartAltRounded />}
    >
      Restart Kenku FM
    </Button>
  );
}

export default RestartButton;
