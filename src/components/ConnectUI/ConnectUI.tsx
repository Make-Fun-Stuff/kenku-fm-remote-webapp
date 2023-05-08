import { Button, Card, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { listPlaylists } from "../../kenku/playlist";

export interface ConnectUIProps {
  connectionSuccess: () => void;
}

function ConnectUI(props: ConnectUIProps) {
  const [cookies, setCookie] = useCookies(["host", "port"]);
  const [host, setHost] = useState<string>(cookies.host);
  const [port, setPort] = useState<string>(cookies.port);
  const [showError, setShowError] = useState(false);

  const connectionSuccess = props.connectionSuccess;

  const checkConnection = useCallback(async () => {
    try {
      if (cookies.host && cookies.port) {
        await listPlaylists({ host: cookies.host, port: cookies.port });
        await connectionSuccess();
      }
    } catch (error) {
      setShowError(true);
    }
  }, [cookies, connectionSuccess]);

  useEffect(() => {
    checkConnection().catch(console.error);
  }, [checkConnection]);

  return (
    <Card
      sx={{ maxWidth: 600, minWidth: 350, marginTop: "20px" }}
      raised={true}
    >
      <div style={{ margin: "20px" }}>
        <Typography variant="h5" style={{ marginBottom: "20px" }}>
          Enter Kenku FM remote configuration
        </Typography>
        {showError && (
          <Typography variant="body2" sx={{ marginBottom: "25px" }}>
            Unable to connect!
          </Typography>
        )}
        <TextField
          style={{ marginTop: "10px", marginRight: "10px" }}
          value={host}
          onChange={(event) => {
            setHost(event.target.value.trim());
            setShowError(false);
          }}
          label="IP Address"
        />
        <TextField
          style={{ marginTop: "10px", marginRight: "10px" }}
          value={port}
          onChange={(event) => {
            setPort(event.target.value.trim());
            setShowError(false);
          }}
          label="Port"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={async () => {
            const cookieExpiry = new Date();
            cookieExpiry.setFullYear(new Date().getFullYear() + 1);
            setCookie("host", host, { expires: cookieExpiry });
            setCookie("port", port, { expires: cookieExpiry });
            await checkConnection();
          }}
        >
          Connect
        </Button>
      </div>
    </Card>
  );
}

export default ConnectUI;
