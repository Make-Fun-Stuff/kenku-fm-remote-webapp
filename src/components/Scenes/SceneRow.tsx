import { DeleteRounded, PlayArrowRounded } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { useContext, useMemo } from "react";
import { useCookies } from "react-cookie";
import { KenkuRemoteConfig } from "../../kenku/kenku";
import { Scene, deleteScene, playScene } from "../../scenes/scenes";
import { CampaignContext, CampaignContextType } from "../../App";

export interface SceneRowProps {
  scene: Scene;
}

function SceneRow(props: SceneRowProps) {
  const { campaign } = useContext(CampaignContext) as CampaignContextType;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, _setCookie] = useCookies(["host", "port"]);
  const kenkuConfig: KenkuRemoteConfig = useMemo(
    () => ({
      host: cookies.host,
      port: cookies.port,
    }),
    [cookies]
  );

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        <IconButton
          disabled={!campaign}
          onClick={async () => {
            await deleteScene(campaign!, props.scene.id);
          }}
        >
          <DeleteRounded />
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        {props.scene.name.toUpperCase()}
      </TableCell>
      <TableCell component="th" scope="row" align="center">
        <IconButton
          onClick={async () => {
            await playScene(kenkuConfig, props.scene);
          }}
        >
          <PlayArrowRounded />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default SceneRow;
