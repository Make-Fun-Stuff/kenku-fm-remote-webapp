import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { sortBy } from "lodash";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { Scene, listScenes } from "../../scenes/scenes";
import SceneRow from "./SceneRow";

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
  const [scenes, setScenes] = useState<Scene[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host", "port"]);
  const kenkuConfig: KenkuRemoteConfig = useMemo(
    () => ({
      host: cookies.host,
      port: cookies.port,
    }),
    [cookies]
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const listResponse = await listScenes();
        setScenes(sortBy(listResponse, (scene) => scene.name));
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
    </div>
  );
}

export default Scenes;
