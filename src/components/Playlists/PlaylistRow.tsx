import { PlayArrowRounded } from "@mui/icons-material";
import {
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { sortBy } from "lodash";
import { useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { play, Playlist } from "../../kenku/playlist";

export interface PlaylistRowProps {
  groupName: string;
  playlists: Playlist[];
  onPlay: (playlist: Playlist) => Promise<void>;
}

const truncateTitle = (title: string) => {
  return title.includes("-")
    ? title.slice(title.indexOf("-") + 1).trim()
    : title;
};

function PlaylistRow(props: PlaylistRowProps) {
  const [selected, setSelected] = useState<Playlist>(
    sortBy(props.playlists, (_) => _.title)[0]
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host", "port"]);
  const kenkuConfig: KenkuRemoteConfig = useMemo(
    () => ({
      host: cookies.host,
      port: cookies.port,
    }),
    [cookies]
  );

  const disabled = !props.playlists.some((_) => !!_.tracks.length);

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell
        component="th"
        scope="row"
        sx={{ color: disabled ? "grey" : undefined }}
      >
        {props.groupName.toUpperCase()}
      </TableCell>
      <TableCell component="th" scope="row">
        {props.playlists.length <= 1 ? undefined : (
          <Select
            variant="standard"
            size="small"
            value={selected.title}
            label={truncateTitle(selected.title.toUpperCase())}
            disabled={disabled}
            onChange={(event) =>
              setSelected(
                props.playlists.find((_) => _.title === event.target.value)!
              )
            }
          >
            {props.playlists.map((playlist, index) => {
              return (
                <MenuItem
                  key={index}
                  value={playlist.title}
                  disabled={!playlist.tracks.length}
                >
                  <Typography variant="subtitle2">
                    {truncateTitle(playlist.title.toUpperCase())}
                  </Typography>
                </MenuItem>
              );
            })}
          </Select>
        )}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <IconButton
          disabled={!selected.tracks.length}
          onClick={async () => {
            await play(kenkuConfig, selected.id);
            props.onPlay(selected);
          }}
        >
          <PlayArrowRounded />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default PlaylistRow;
