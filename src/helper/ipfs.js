// const VITE_PIN_API_KEY = import.meta.env.VITE_PIN_API_KEY;
// const VITE_PIN_API_SECRET = import.meta.env.VITE_PIN_API_SECRET;

//import pinataSDK from '@pinata/sdk';
// import fs from 'fs';
// import path from 'path';

//const pinata = pinataSDK(VITE_PIN_API_KEY, VITE_PIN_API_SECRET);
export async function pinJSONToIPFS(data, fileName) {
//   try {
//       const directoryPath = path.join('/tmp/HatMetadata');
//       if (!fs.existsSync(directoryPath)) {
//           fs.mkdirSync(directoryPath, { recursive: true });
//       }

//       const filePath = path.join(directoryPath, fileName);
//       fs.writeFileSync(filePath, JSON.stringify(data));

//       const result = await pinata.pinFromFS(directoryPath, {
//           pinataOptions: {
//               wrapWithDirectory: true
//           }
//       });

//       const cid = result.IpfsHash;
//       console.log('Pinned JSON:', result);
//       return `${cid}/${fileName}`;
//   } catch (error) {
//       console.error(error);
//   }
}