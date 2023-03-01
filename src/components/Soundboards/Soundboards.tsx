import {
  Button,
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
import {
  play,
  stop,
  getPlayback,
  listSoundboards,
  ListSoundboardsResponse,
  Soundboard,
} from "../../kenku/soundboard";
import { sortBy } from "lodash";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";

export interface SoundboardsProps {
  connectionFailure: () => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function Soundboards(props: SoundboardsProps) {
  const [loading, setLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [soundboards, setSoundboards] = useState<ListSoundboardsResponse>({
    soundboards: [],
    sounds: [],
  });
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
        setSoundboards(await listSoundboards(kenkuConfig));
        setHadError(false);
      } catch (error) {
        setHadError(true);
        connectionFailure();
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [kenkuConfig, connectionFailure]);

  if (loading) {
    return <div />;
  }

  const playSoundEffects = async (soundboard: Soundboard, replace: boolean) => {
    if (replace) {
      const playback = await getPlayback(kenkuConfig);
      await Promise.all(playback.sounds.map((_) => stop(kenkuConfig, _.id)));
    }
    await Promise.all(soundboard.sounds.map((_) => play(kenkuConfig, _)));
  };

  return hadError ? (
    <div />
  ) : (
    <div
      style={{
        marginTop: "50px",
        marginBottom: "50px",
        marginLeft: "30px",
        marginRight: "30px",
      }}
    >
      <Typography variant="h5" marginBottom={"20px"}>
        Sound Effects
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Sound Effect Group</StyledTableCell>
              <StyledTableCell align="center">
                Add to Current Sound Effects
              </StyledTableCell>
              <StyledTableCell align="center">
                Replace Current Sound Effects
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(
              soundboards.soundboards,
              (_) => `${_.sounds.length ? "" : "zzz"}${_.title}`
            ).map((soundboard, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {soundboard.title.toUpperCase()}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  <Button
                    variant="contained"
                    disabled={!soundboard.sounds.length}
                    onClick={() => playSoundEffects(soundboard, false)}
                  >
                    Add
                  </Button>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" align="center">
                  <Button
                    variant="contained"
                    disabled={!soundboard.sounds.length}
                    onClick={() => playSoundEffects(soundboard, true)}
                  >
                    Replace
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Soundboards;
