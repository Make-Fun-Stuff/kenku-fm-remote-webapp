import {
  Button,
  Grid,
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
  listPlaylists,
  ListPlaylistsResponse,
  play,
  Playlist,
} from "../../kenku/playlist";
import { sortBy } from "lodash";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import PlaylistRow from "./PlaylistRow";
import { PlayArrowRounded } from "@mui/icons-material";

export interface PlaylistsProps {
  connectionFailure: () => void;
}

const NUM_RECENT = 2;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function Playlists(props: PlaylistsProps) {
  const [loading, setLoading] = useState(true);
  const [hadError, setHadError] = useState(false);
  const [playlists, setPlaylists] = useState<ListPlaylistsResponse>({
    playlists: [],
    tracks: [],
  });
  const [mostRecent, setMostRecent] = useState<Playlist[]>([]);
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
        setPlaylists(await listPlaylists(kenkuConfig));
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

  const updateMostRecent = (newPlaylist: Playlist) => {
    setMostRecent([newPlaylist, ...mostRecent.slice(0, NUM_RECENT)]);
  };

  if (loading) {
    return <div />;
  }

  const groupedPlaylists = playlists.playlists.reduce((grouped, playlist) => {
    const index = playlist.title.indexOf("-");
    if (index < 0) {
      return {
        ...grouped,
        [playlist.title]: [playlist],
      };
    }
    const group = playlist.title.slice(0, index).trim();
    return {
      ...grouped,
      [group]: [
        ...(grouped[group] || []),
        {
          ...playlist,
          title: playlist.title,
        },
      ],
    };
  }, {} as Record<string, Playlist[]>);

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
        Music
      </Typography>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        marginBottom={"30px"}
      >
        {mostRecent.slice(1).map((playlist, index) => {
          return (
            <Grid
              item
              key={index}
              xs={Math.floor(12 / NUM_RECENT)}
              alignItems="center"
              justifyContent="center"
            >
              <Button
                startIcon={<PlayArrowRounded />}
                variant="contained"
                sx={{
                  width: "95%",
                  height: "75px",
                }}
                onClick={async () => {
                  await play(kenkuConfig, playlist.id);
                  updateMostRecent(playlist);
                }}
              >
                {playlist.title}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Playlist</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell align="center">Play</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(Object.keys(groupedPlaylists), (group) => {
              return `${
                !groupedPlaylists[group].some((_) => !!_.tracks.length)
                  ? "zzz"
                  : ""
              }${group}`;
            }).map((groupName, index) => (
              <PlaylistRow
                key={index}
                groupName={groupName}
                playlists={sortBy(groupedPlaylists[groupName], (_) => _.title)}
                onPlay={async (playlist: Playlist) =>
                  updateMostRecent(playlist)
                }
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Playlists;
