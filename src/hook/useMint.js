import { useCallback } from 'react';
import { pinJSONToIPFS } from '../helper/ipfs';
import { TESTNET_URL } from '../helper/constants';
import imageData from '../helper/imageData';
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(`${TESTNET_URL}`);

const useMint = () => {
    const handleMint = useCallback(async (name, attributesJson, equipmentType) => {
        const attributes = JSON.parse(attributesJson);
        const formattedName = name.slice(0, -2);
        const tokenId = Math.floor(Math.random() * 1000000); // Generate a random tokenId
        const imageUrl = imageData[equipmentType] || 'DEFAULT_IMAGE_URL'; // Provide a default URL if name not found

        const data = {
            description: "Aqua Bag",
            image: `${imageUrl}/${tokenId}`,
            name: formattedName,
            attributes: [
                { trait_type: "Strength", value: attributes.strength },
                { trait_type: "Intelligence", value: attributes.intelligence },
                { trait_type: "Charisma", value: attributes.charisma },
                { trait_type: "Luck", value: attributes.luck },
                { trait_type: "Defense", value: attributes.defense }
            ],
        };

        const fileName = `${tokenId}.json`;
        const filePath = await pinJSONToIPFS(data, fileName);
        // TODO: connect Account to mint Blockchain
        console.log(`Minting with metadata: https://rose-occupational-bee-58.mypinata.cloud/ipfs/${filePath}`);
        const result = await account.execute({
            contractAddress: myContractAddress,
            entrypoint: 'transfer',
            calldata: CallData.compile({
              recipient: receiverAddress,
              amount: cairo.uint256(100000n),
            }),
          });
          await provider.waitForTransaction(result.transaction_hash);
    }, []);

    return { handleMint };
};

export default useMint;
