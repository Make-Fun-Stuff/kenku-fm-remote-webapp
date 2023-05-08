import { createContext, useState } from "react";
import "./App.css";
import ConnectUI from "./components/ConnectUI/ConnectUI";
import PlaylistController from "./components/PlaylistController/PlaylistController";
import Playlists from "./components/Playlists/Playlists";
import RestartButton from "./components/RestartButton/RestartButton";
import SoundboardController from "./components/SoundboardController/SoundboardController";
import Soundboards from "./components/Soundboards/Soundboards";
import Scenes from "./components/Scenes/Scenes";
import SaveSceneButton from "./components/Scenes/SaveSceneButton";

export interface CampaignContextType {
  setCampaign: (_: string) => void;
  campaign?: string;
}

export const CampaignContext = createContext<CampaignContextType | null>(null);

function App() {
  const [connected, setConnected] = useState(false);
  const [campaign, setCampaign] = useState<string>();
  return (
    <div className="App">
      {!connected ? (
        <div>
          <ConnectUI connectionSuccess={() => setConnected(true)} />
          <RestartButton />
        </div>
      ) : (
        <CampaignContext.Provider value={{ campaign, setCampaign }}>
          <PlaylistController connectionFailure={() => setConnected(false)} />
          <SoundboardController connectionFailure={() => setConnected(false)} />
          <SaveSceneButton />
          <Playlists connectionFailure={() => setConnected(false)} />
          <Soundboards connectionFailure={() => setConnected(false)} />
          <Scenes />
          <RestartButton />
        </CampaignContext.Provider>
      )}
    </div>
  );
}

export default App;
