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
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((i) => i.kind === "videoinput");
      setDevices(videoDevices);
    })();
  }, []);

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
          numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
          videoSourceDeviceId={activeDeviceId}
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Permission denied. Please refresh and give camera permission.",
            switchCamera:
              "It is not possible to switch camera to different one because there is only one video device accessible.",
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
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
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
          onClick={() => {
            if (cameraRef.current) {
              const photo = cameraRef.current.takePhoto({
                quality: 1,
              });
              setImage(photo);
            }
          }}
        />
        {torchToggled && (
          <button
            className="button torch-button toggled"
            onClick={() => {
              if (cameraRef.current) {
                setTorchToggled(cameraRef.current.toggleTorch());
              }
            }}
          />
        )}
        <button
          className="button change-facing-camera-button"
          disabled={numberOfCameras <= 1}
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.switchCamera();
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
