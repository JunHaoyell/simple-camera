import React, { useEffect, useRef, useState } from "react";
import "./App.css"; // Import your CSS file
import { Camera } from "react-camera-pro";

function App() {
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(undefined);
  const [torchToggled, setTorchToggled] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };
    getDevices();
  }, []);

  const takeHighResolutionPhoto = async () => {
    try {
      if (cameraRef.current) {
        const capabilities = await cameraRef.current.getCameraCapabilities();
        const maxResolution = capabilities.reduce((prev, current) =>
          prev.width * prev.height > current.width * current.height
            ? prev
            : current
        );
        const { width, height } = maxResolution;
        const photo = await cameraRef.current.takePhoto({ width, height });
        setImage(photo);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  return (
    <div className="wrapper">
      {showImage ? (
        <div
          className="full-screen-image-preview"
          style={{ backgroundImage: `url(${image})` }}
          onClick={() => {
            setShowImage(!showImage);
          }}
        />
      ) : (
        <Camera
          ref={cameraRef}
          aspectRatio="cover"
          facingMode="environment"
          numberOfCamerasCallback={(count) => setNumberOfCameras(count)}
          videoSourceDeviceId={activeDeviceId}
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to a different one because there is only one video device accessible.",
            canvas: "Canvas is not supported.",
          }}
          videoReadyCallback={() => {
            console.log("Video feed ready.");
          }}
        />
      )}
      <div className="control">
        <select
          onChange={(event) => {
            setActiveDeviceId(event.target.value);
          }}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
        <div
          className="image-preview"
          style={{ backgroundImage: `url(${image})` }}
          onClick={() => {
            setShowImage(!showImage);
          }}
        />
        <button
          className="button take-photo-button"
          onClick={takeHighResolutionPhoto}
        >
          Take Photo
        </button>
        {torchToggled && (
          <button
            className="button torch-button toggled"
            onClick={() => {
              if (cameraRef.current) {
                setTorchToggled(cameraRef.current.toggleTorch());
              }
            }}
          >
            Toggle Torch
          </button>
        )}
        <button
          className="button change-facing-camera-button"
          disabled={numberOfCameras <= 1}
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.switchCamera();
            }
          }}
        >
          Switch Camera
        </button>
      </div>
    </div>
  );
}

export default App;
