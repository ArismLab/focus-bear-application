import { stark, shortString, uint256, RpcProvider, Account } from 'starknet';
import dotenv from 'dotenv';
dotenv.config();

const provider = new RpcProvider({ nodeUrl: `https://starknet-sepolia.public.blastapi.io/rpc/v0_7` });
const privateKey = process.env.VALIDATOR_KEY; // Private key of the signer
const validatorAddress = process.env.VALIDATOR_ADDRESS; // Replace with the actual validator address

function getMessage(recipient, token_id, nonce, expiry) {
    return {
        domain: {
            chainId: shortString.encodeShortString('SN_SEPOLIA'), // 'SN_SEPOLIA' (or 'SN_MAIN')
            name: 'BEARCollection',
            version: 'v1',
        },
        message: {
            recipient,
            token_id,
            nonce,
            expiry,
        },
        primaryType: 'Message',
        types: {
            Message: [
                { name: 'recipient', type: 'felt' },
                { name: 'token_id', type: 'u256' },
                { name: 'nonce', type: 'felt' },
                { name: 'expiry', type: 'felt' },
            ],
            u256: [
                { name: 'low', type: 'felt' },
                { name: 'high', type: 'felt' },
            ],
            StarkNetDomain: [
                { name: 'name', type: 'felt' },
                { name: 'version', type: 'felt' },
                { name: 'chainId', type: 'felt' },
            ],
        },
    };
}

// Parameters (replace with actual values)
const recipient = "0x0657bcf6a26095f9b26e3633f01c733c2a0aff24915b531351e9f432176b1ada";
const tokenId = uint256.bnToUint256(0); // Replace with your actual token ID

const nonce = "0";
const expiry = "1819340135";

const message = getMessage(recipient, tokenId, nonce, expiry);


async function signMessage() {
    const validatorInstance = new Account(provider, validatorAddress, privateKey);
    console.log(message)
    const signature = await validatorInstance.signMessage(message);
    const formattedSignature = stark.formatSignature(signature);
    //   console.log(`Message: ${JSON.stringify(message, null, 2)}`); 
    console.log(`Format Signature: ${formattedSignature}`);
    return formattedSignature;
}

signMessage().catch(console.error);
