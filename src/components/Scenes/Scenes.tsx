import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { CampaignScenes, addCampaign, listScenes } from "../../scenes/scenes";
import SceneRow from "./SceneRow";
import { AddRounded } from "@mui/icons-material";
import { CampaignContext } from "../../App";
import { CampaignContextType } from "../../App";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function Scenes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [newCampaignError, setNewCampaignError] = useState<string>();
  const [newCampaignInput, setNewCampaignInput] = useState<string>("");
  const { campaign, setCampaign } = useContext(
    CampaignContext
  ) as CampaignContextType;
  const [campaignScenes, setCampaignScenes] = useState<CampaignScenes>({});

  const scenes = campaign ? campaignScenes[campaign] : [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(["host", "port", "campaign"]);
  const kenkuConfig: KenkuRemoteConfig = useMemo(
    () => ({
      host: cookies.host,
      port: cookies.port,
    }),
    [cookies]
  );

  useEffect(() => {
    if (!campaign) {
      const setDefaultCampaign = async () => {
        const listResponse = await listScenes();
        if (cookies.campaign && listResponse.hasOwnProperty(cookies.campaign)) {
          setCampaign(cookies.campaign);
        } else {
          setCampaign(Object.keys(listResponse).sort()[0]);
        }
      };
      setDefaultCampaign();
    }
  }, [campaign, setCampaign, cookies.campaign]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const listResponse = await listScenes();
        setCampaignScenes(listResponse);
        setError(undefined);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unexpected error type"
        );
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [kenkuConfig]);

  if (loading) {
    return <div />;
  }

  return error ? (
    <div>{error}</div>
  ) : (
    <div
      style={{
        marginTop: "50px",
        marginBottom: "50px",
        marginLeft: "10px",
        marginRight: "10px",
      }}
    >
      <Typography variant="h5" marginBottom={"20px"}>
        Scenes
      </Typography>

      <Paper sx={{ marginBottom: "15px" }}>
        <Select
          value={campaign || "No campaign selected"}
          label="Campaign"
          variant="standard"
          sx={{ width: "100%" }}
          onChange={(event: SelectChangeEvent) => {
            setCampaign(event.target.value);
            const cookieExpiry = new Date();
            cookieExpiry.setFullYear(new Date().getFullYear() + 1);
            setCookie("campaign", event.target.value, {
              expires: cookieExpiry,
            });
          }}
        >
          {Object.keys(campaignScenes)
            .sort()
            .map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Delete</StyledTableCell>
              <StyledTableCell>Scene</StyledTableCell>
              <StyledTableCell align="center">Play</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scenes.length ? (
              scenes.map((scene, index) => (
                <SceneRow key={index} scene={scene} />
              ))
            ) : (
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>
                  <i>No scenes have been defined</i>
                </StyledTableCell>
                <StyledTableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Card sx={{ minWidth: 400, marginTop: "15px" }} raised={true}>
        <CardContent>
          <Grid container={true}>
            <TextField
              value={newCampaignInput}
              sx={{ width: "70%" }}
              label="New Campaign"
              onChange={(event) => {
                setNewCampaignInput(event.target.value);
              }}
            />
            <Button
              sx={{ width: "25%", ml: "5%" }}
              type="submit"
              variant="contained"
              disabled={!newCampaignInput.trim().length}
              onClick={async () => {
                try {
                  await addCampaign(newCampaignInput.trim());
                  setNewCampaignInput("");
                } catch (error) {
                  setNewCampaignError(
                    error instanceof Error ? error.message : "Unknown error"
                  );
                }
              }}
              startIcon={<AddRounded />}
            >
              Add
            </Button>
          </Grid>
          {newCampaignError && (
            <Alert sx={{ mt: "10px" }} severity="error">
              {newCampaignError}
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Scenes;
