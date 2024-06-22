const JWT = "YOUR_JWT";  

const data = JSON.stringify({
  pinataContent: {
    name: "Pinnie",
    description: "A really sweet NFT of Pinnie the Pinata",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*6jAXBRvIrI_HtKuqSa2OEg.jpeg",
    external_url: "https://arisumin.com", 
    attributes: [
      {
        trait_type: "Color",
        value: "Blue"
      },
      {
        trait_type: "Eyes",
        value: "Wide"
      },
      {
        trait_type: "Mouth",
        value: "Smiling"
      }
    ]
  },
  pinataMetadata: {
    name: "metadata.json"
  }
})

async function pinJSONToIPFS() {
  try {
    
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT}`,
      },
      body: data,
    });
    const resData = await res.json();
    console.log(resData);
  } catch (error) {
    console.log(error);
  }
};

pinJSONToIPFS()