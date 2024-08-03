import React, { useState, useEffect } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";

const UnityComponent = ({ handleCreateWallet, handleExportKey }) => {
  const { unityProvider, isLoaded, loadingProgression, addEventListener, removeEventListener } = useUnityContext({
    productName: "Focus Bear",
    productVersion: "1.0.0",
    companyName: "Arism Lab",
    loaderUrl: "assets/BuildGame.loader.js",
    dataUrl: "assets/BuildGame.data.unityweb",
    frameworkUrl: "assets/BuildGame.framework.js.unityweb",
    codeUrl: "assets/BuildGame.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
  });

  useEffect(() => {
    addEventListener('OnCreateWalletButtonClicked', handleCreateWallet);
    addEventListener('OnExportKeyButtonClicked', handleExportKey);

    return () => {
      removeEventListener('OnCreateWalletButtonClicked', handleCreateWallet);
      removeEventListener('OnExportKeyButtonClicked', handleExportKey);
    };
  }, [addEventListener, removeEventListener, handleCreateWallet, handleExportKey]);

  const loadingPercentage = Math.round(loadingProgression * 100);

  return (
    <div id="unity-container" className="unity-responsive">
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100%", height: "100%" }}
      />
      {!isLoaded && (
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div id="unity-progress-bar-full" style={{ width: `${loadingPercentage}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnityComponent;
