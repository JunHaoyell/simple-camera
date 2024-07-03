import "./App.css";
import { Camera } from "react-camera-pro";

function App() {
  return (
    <div className="App">
      <Camera
        onCapture={(dataUri) => {
          console.log("Image captured:", dataUri);
          // Handle captured image here
        }}
      />
    </div>
  );
}

export default App;
