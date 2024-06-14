import React, { useEffect, useState } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import './App.css'

const telegram = window.Telegram.WebApp;

function App() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    productName: "Focus Bear",
    productVersion: "1.0.0",
    companyName: "Arism Lab",
    loaderUrl: "src/assets/BuildGame.loader.js",
    dataUrl: "src/assets/BuildGame.data.unityweb",
    frameworkUrl: "src/assets/BuildGame.framework.js.unityweb",
    codeUrl: "src/assets/BuildGame.wasm.unityweb",
    streamingAssetsUrl: "src/StreamingAssets",
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  useEffect(    
    function () {
      telegram.ready();
      telegram.MainButton.text = "Hellooo";
      telegram.MainButton.show();
      // A function which will update the device pixel ratio of the Unity
      // Application to match the device pixel ratio of the browser.
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      // A media matcher which watches for changes in the device pixel ratio.
      const mediaMatcher = window.matchMedia(
        `screen and (resolution: ${devicePixelRatio}dppx)`
      );
      // Adding an event listener to the media matcher which will update the
      // device pixel ratio of the Unity Application when the device pixel
      // ratio changes.
      mediaMatcher.addEventListener("change", updateDevicePixelRatio);
      return function () {
        // Removing the event listener when the component unmounts.
        mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      };
    },
    [devicePixelRatio]
  );

  return (
    <div id="unity-container" className="unity-responsive">
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100%", height: "100%" }}
        devicePixelRatio={devicePixelRatio}
      />
      {!isLoaded && (
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div
              id="unity-progress-bar-full"
              style={{ width: `${loadingProgression * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App
