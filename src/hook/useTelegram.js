import { useEffect, useCallback, useState } from 'react';
import { ethers } from 'ethers';

const useTelegram = (sendMessage) => {
  const telegram = window.Telegram.WebApp;
  const [accessGranted, setAccessGranted] = useState(false);
  const [beraKey, setBeraKey] = useState("");
  const [beraAddress, setBeraAddress] = useState("");
  
  useEffect(() => {
    telegram.ready();
    telegram.isClosingConfirmationEnabled = true;
    telegram.BiometricManager.init(() => {});
  }, [telegram]);

  const sendCreatedWallet = useCallback((message) => {
    sendMessage("AddressLayout", "SetAddress", message);
  }, [sendMessage]);

  const sendAuthorizedMessage = useCallback((message) => {
    sendMessage("DialogCanvas", "SetMessageText", message);
  }, [sendMessage]);

  const createBeraAddress = useCallback(() => {
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const address = wallet.address;

    setBeraKey(privateKey);
    setBeraAddress(address);
    return { address, privateKey };
  }, []);

  // useEffect(() => {
  //   if (accessGranted) {
  //     telegram.BiometricManager.authenticate({ reason: 'Authenticate to store private key' }, (isAuthenticated, biometricToken) => {
  //       if (isAuthenticated) {
  //         const privateKey = beraKey;

  //         telegram.BiometricManager.updateBiometricToken(privateKey, (isUpdated) => {
  //           if (isUpdated) {
  //             createBeraAddress();
  //           } else {
  //             sendAuthorizedMessage('Failed to create the Address.');
  //           }
  //         });
  //       } else {
  //         sendAuthorizedMessage('Authentication failed.');
  //       }
  //     });
  //     console.log('Updated account address=', beraAddress);
  //   }
  // }, [beraAddress, beraKey, sendCreatedWallet, sendAuthorizedMessage, telegram]);

  const handleCreateWallet = useCallback(() => {
    const params = {
      reason: "Securely store your private key using biometric authentication"
    };

    if (!telegram.BiometricManager.isInited) {
      console.error('BiometricManager is not initialized');
      return;
    }

    if (!accessGranted) {
      telegram.BiometricManager.requestAccess(params, (isAccessGranted) => {
        if (isAccessGranted) {
          setAccessGranted(true);
        } else {
          sendAuthorizedMessage("Access Denied. Fail to create Account");
          setAccessGranted(false);
        }
      });
    }

    if (accessGranted) {
      telegram.BiometricManager.authenticate({ reason: 'Authenticate to store private key' }, (isAuthenticated) => {
        const { address, privateKey } = createBeraAddress();

        if (isAuthenticated) {
          telegram.BiometricManager.updateBiometricToken(privateKey, (isUpdated) => {
            if (isUpdated) {
              sendCreatedWallet(address);
            } else {
              sendAuthorizedMessage('Failed to create the Address.');
            }
          });
        } else {
          sendAuthorizedMessage('Authentication failed.');
        }
      });
      console.log('Updated account address=', beraAddress);
    }
  }, [accessGranted, createBeraAddress, beraKey, sendAuthorizedMessage, sendCreatedWallet, telegram]);

  const handleExportKey = useCallback(() => {
    telegram.BiometricManager.authenticate({ reason: 'Authenticate to retrieve private key' }, (isAuthenticated, biometricToken) => {
      if (isAuthenticated) {
        const message = biometricToken.toString();
        sendAuthorizedMessage(message);
      } else {
        console.error('Authentication failed.');
      }
    });
  }, [sendAuthorizedMessage, telegram]);

  return {
    accessGranted,
    handleCreateWallet,
    handleExportKey,
    setBeraAddress,
    beraAddress, // Expose beraAddress to be used in createUser hook
  };
};

export default useTelegram;
