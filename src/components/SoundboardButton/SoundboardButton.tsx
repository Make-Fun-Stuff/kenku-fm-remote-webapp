import { Merge } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Soundboard } from "../../kenku/soundboard";

export interface SoundboardButtonProps {
  soundboard: Soundboard;
  play: () => Promise<void>;
}

function SoundboardButton(props: SoundboardButtonProps) {
  return (
    <Button
      disabled={!props.soundboard.sounds.length}
      onClick={async () => {
        await props.play();
      }}
      style={{
        minWidth: "25ch",
        maxWidth: "25ch",
        justifyContent: "flex-start",
      }}
      variant={"contained"}
      startIcon={<Merge />}
    >
      {props.soundboard.title}
    </Button>
  );
}

export default SoundboardButton;
