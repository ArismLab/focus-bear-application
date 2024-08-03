import React, { useEffect, useState } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import './App.css';
import { TESTNET_URL } from './helper/constants';
import useTelegram from './hook/useTelegram';
import useMint from './hook/useMint';
import { ethers } from 'ethers';
import CustomLoadingBar from './components/CustomLoadingBar';

const provider = new ethers.JsonRpcProvider(`${TESTNET_URL}`);

function App() {
  const {
    unityProvider,
    isLoaded,
    loadingProgression,
    addEventListener,
    removeEventListener,
    sendMessage,
  } = useUnityContext({
    productName: 'Focus Bear',
    productVersion: '1.0.0',
    companyName: 'Arism Lab',
    loaderUrl: 'assets/BuildGame.loader.js',
    dataUrl: 'assets/BuildGame.data.unityweb',
    frameworkUrl: 'assets/BuildGame.framework.js.unityweb',
    codeUrl: 'assets/BuildGame.wasm.unityweb',
    streamingAssetsUrl: 'StreamingAssets',
  });

  const { accessGranted, handleCreateWallet, handleExportKey, setBeraAddress, beraAddress } = useTelegram(sendMessage);
  const { handleMint } = useMint();

  const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);

  // Mint Event Listener
  useEffect(() => {
    addEventListener('OnMintButtonClicked', handleMint);
    return () => {
      removeEventListener('OnMintButtonClicked', handleMint);
    };
  }, [addEventListener, removeEventListener, handleMint]);

  // Hide Main Screen if Access Granted
  useEffect(() => {
    if (accessGranted && (beraAddress != "")) {
      sendMessage('MainGameCanvas', 'HideMainScreen');
    }
  }, [accessGranted, beraAddress, sendMessage]);

  // Create Wallet Event Listener
  useEffect(() => {
    addEventListener('OnCreateWalletButtonClicked', handleCreateWallet);
    return () => {
      removeEventListener('OnCreateWalletButtonClicked', handleCreateWallet);
    };
  }, [addEventListener, removeEventListener, handleCreateWallet]);

  // Export Key Event Listener
  useEffect(() => {
    addEventListener('OnExportKeyButtonClicked', handleExportKey);
    return () => {
      removeEventListener('OnExportKeyButtonClicked', handleExportKey);
    };
  }, [addEventListener, removeEventListener, handleExportKey]);

  useEffect(
    function () {
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
        style={{ width: '100%', height: '100%' }}
        devicePixelRatio={devicePixelRatio}
      />
      {!isLoaded && <CustomLoadingBar progress={loadingProgression} />}
    </div>
  );
}

export default App;
