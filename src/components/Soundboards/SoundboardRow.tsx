import { MergeRounded, PlayArrowRounded } from "@mui/icons-material";
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
import { getPlayback, play, Soundboard, stop } from "../../kenku/soundboard";

export interface SoundboardRowProps {
  groupName: string;
  soundboards: Soundboard[];
}

function SoundboardRow(props: SoundboardRowProps) {
  const [selected, setSelected] = useState<Soundboard>(
    sortBy(props.soundboards, (_) => _.title)[0]
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

  const disabled = !props.soundboards.some((_) => !!_.sounds.length);

  const playSoundEffects = async (soundboard: Soundboard, replace: boolean) => {
    if (replace) {
      const playback = await getPlayback(kenkuConfig);
      await Promise.all(playback.sounds.map((_) => stop(kenkuConfig, _.id)));
    }
    await Promise.all(soundboard.sounds.map((_) => play(kenkuConfig, _)));
  };

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
        {props.soundboards.length <= 1 ? undefined : (
          <Select
            variant="standard"
            size="small"
            value={selected.title}
            label={selected.title.toUpperCase()}
            disabled={disabled}
            onChange={(event) =>
              setSelected(
                props.soundboards.find((_) => _.title === event.target.value)!
              )
            }
          >
            {props.soundboards.map((soundboard, index) => {
              return (
                <MenuItem
                  key={index}
                  value={soundboard.title}
                  disabled={!soundboard.sounds.length}
                >
                  <Typography variant="subtitle2">
                    {soundboard.title.toUpperCase()}
                  </Typography>
                </MenuItem>
              );
            })}
          </Select>
        )}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <IconButton
          disabled={!selected.sounds.length}
          onClick={() => playSoundEffects(selected, false)}
        >
          <MergeRounded />
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <IconButton
          disabled={!selected.sounds.length}
          onClick={() => playSoundEffects(selected, true)}
        >
          <PlayArrowRounded />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default SoundboardRow;
