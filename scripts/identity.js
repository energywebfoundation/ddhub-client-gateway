const { utils, Wallet } = require('ethers');

// replace with your own
const PRIVATE_KEY = 'a229bf8f1bc264f2981f33f65f26302d5adebae767eb361e767add52e52c76d7';

const generateIdentity = async (privateKey) => {
  const signer = new Wallet(privateKey);

  const header = {
      alg: 'ES256',
      typ: 'JWT'
  };

  const encodedHeader = utils.base64.encode(Buffer.from(JSON.stringify(header)));

  const address = await signer.getAddress();
  const did = `did:ethr:${address}`;

  const payload = {
      iss: did,
      claimData: {
          blockNumber: 999999999999
      }
  };

  const encodedPayload = utils.base64.encode(Buffer.from(JSON.stringify(payload)));

  const message = utils.arrayify(
      utils.keccak256(Buffer.from(`${encodedHeader}.${encodedPayload}`))
  );
  const sig = await signer.signMessage(message);
  const encodedSig = utils.base64.encode(Buffer.from(sig));

  return `${encodedHeader}.${encodedPayload}.${encodedSig}`;
};

generateIdentity(PRIVATE_KEY).then(console.log).catch(console.error);
