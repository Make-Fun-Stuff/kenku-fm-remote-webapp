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
import {
  listSoundboards,
  ListSoundboardsResponse,
  Soundboard,
} from "../../kenku/soundboard";
import { sortBy } from "lodash";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import SoundboardRow from "../SoundboardRow/SoundboardRow";

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

  const groupedSoundboards = soundboards.soundboards.reduce(
    (grouped, soundboard) => {
      const index = soundboard.title.indexOf("-");
      if (index < 0) {
        return {
          ...grouped,
          [soundboard.title]: [soundboard],
        };
      }
      const group = soundboard.title.slice(0, index).trim();
      return {
        ...grouped,
        [group]: [
          ...(grouped[group] || []),
          {
            ...soundboard,
            title: soundboard.title.slice(index + 1).trim(),
          },
        ],
      };
    },
    {} as Record<string, Soundboard[]>
  );

  return hadError ? (
    <div />
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
        Soundboards
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Soundboard</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="center">Add</StyledTableCell>
              <StyledTableCell align="center">Replace</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(Object.keys(groupedSoundboards), (group) => {
              return `${
                !groupedSoundboards[group].some((_) => !!_.sounds.length)
                  ? "zzz"
                  : ""
              }${group}`;
            }).map((groupName, index) => (
              <SoundboardRow
                key={index}
                groupName={groupName}
                soundboards={sortBy(
                  groupedSoundboards[groupName],
                  (_) => _.title
                )}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Soundboards;
