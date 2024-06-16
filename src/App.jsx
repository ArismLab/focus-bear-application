import React, { useEffect, useCallback, useState } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import './App.css'

const telegram = window.Telegram.WebApp;

function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [keyAuthorized, setKeyAuthorized] = useState("");

  const { unityProvider, isLoaded, loadingProgression, addEventListener, removeEventListener, sendMessage } = useUnityContext({
    productName: "Focus Bear",
    productVersion: "1.0.0",
    companyName: "Arism Lab",
    loaderUrl: "assets/BuildGame.loader.js",
    dataUrl: "assets/BuildGame.data.unityweb",
    frameworkUrl: "assets/BuildGame.framework.js.unityweb",
    codeUrl: "assets/BuildGame.wasm.unityweb",
    streamingAssetsUrl: "StreamingAssets",
  });

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  const handleCreateWallet = useCallback(() => {
    const params = {
      reason: "Securely store your private key using biometric authentication"
    };
  
    telegram.BiometricManager.requestAccess(params, (isAccessGranted) => {
      if (isAccessGranted) {
        telegram.MainButton.text = "Access Granted " + telegram.BiometricManager.isInited + " " + telegram.BiometricManager.isBiometricAvailable;
        setAccessGranted(true);
        
        // Proceed with authentication
        telegram.BiometricManager.authenticate({ reason: 'Authenticate to store private key' }, (isAuthenticated, biometricToken) => {
          if (isAuthenticated) {
            const privateKey = 'your-private-key-here'; // Replace with your actual private key
            
            // Store the private key using the biometric token
            telegram.BiometricManager.updateBiometricToken(privateKey, (isUpdated) => {
              if (isUpdated) {
                telegram.MainButton.text = 'Private key: ' + biometricToken;
              } else {
                telegram.MainButton.text = 'Failed to store the private key.';
              }
            });
          } else {
            console.error('Authentication failed.');
          }
        });
  
      } else {
        telegram.MainButton.text = "Access Denied " + telegram.BiometricManager.isInited + " " + telegram.BiometricManager.isBiometricAvailable;
        setAccessGranted(false);
      }
      telegram.MainButton.show();
    });

  }, []);

  const handleExportKey = useCallback(() => {  
    telegram.BiometricManager.authenticate({ reason: 'Authenticate to get private key' }, (isAuthenticated, biometricToken) => {
      if (isAuthenticated) {        
        // Return the private key using the biometric token
        const message = biometricToken.toString();
        setKeyAuthorized(message);
        telegram.MainButton.text = 'Private key: ' + message;
        telegram.MainButton.show();
      } else {
        console.error('Authentication failed.');
      }
    });
  }, []);


  useEffect(() => {
    sendMessage("MainGameCanvas", "HideMainScreen");
  }, [accessGranted]);

  useEffect(() => {
    sendMessage("DialogCanvas", "SetDialogText", keyAuthorized);
  }, [keyAuthorized]);

  useEffect(() => {
    addEventListener('OnCreateWalletButtonClicked', handleCreateWallet);

    return () => {
      removeEventListener('OnCreateWalletButtonClicked', handleCreateWallet);
    };
  }, [addEventListener, removeEventListener, handleCreateWallet]);

  useEffect(() => {
    addEventListener('OnExportKeyButtonClicked', handleExportKey);

    return () => {
      removeEventListener('OnExportKeyButtonClicked', handleExportKey);
    };
  }, [addEventListener, removeEventListener, handleExportKey]);

  useEffect(
    function () {
      telegram.ready();
      telegram.isClosingConfirmationEnabled = true;
        
      telegram.BiometricManager.init(() => {});

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
