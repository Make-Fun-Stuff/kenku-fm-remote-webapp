import { useState } from "react";
import "./App.css";
import ConnectUI from "./components/ConnectUI/ConnectUI";
import PlaylistController from "./components/PlaylistController/PlaylistController";
import Playlists from "./components/Playlists/Playlists";
import RestartButton from "./components/RestartButton/RestartButton";
import SoundboardController from "./components/SoundboardController/SoundboardController";
import Soundboards from "./components/Soundboards/Soundboards";
import Scenes from "./components/Scenes/Scenes";
import SaveSceneButton from "./components/Scenes/SaveSceneButton";

function App() {
  const [connected, setConnected] = useState(false);
  return (
    <div className="App">
      {!connected ? (
        <div>
          <ConnectUI connectionSuccess={() => setConnected(true)} />
          <RestartButton />
        </div>
      ) : (
        <div>
          <PlaylistController connectionFailure={() => setConnected(false)} />
          <SoundboardController connectionFailure={() => setConnected(false)} />
          <SaveSceneButton />
          <Playlists connectionFailure={() => setConnected(false)} />
          <Soundboards connectionFailure={() => setConnected(false)} />
          <Scenes />
          <RestartButton />
        </div>
      )}
    </div>
  );
}

export default App;
