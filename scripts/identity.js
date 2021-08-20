const { utils, Wallet, providers } = require('ethers');

// replace with your own
// const PRIVATE_KEY = '0xe2caca2e7c22fc5bf985cc6838e152753c52b925620bf2449e388c90e3d853f7'
// const PRIVATE_KEY = '62e16b8d04f82d5be6f48e1c752171e838b681fab065028ebb9d73870696781a'
const PRIVATE_KEY2 = 'f4eacfd15e666742858d7ec71ab062a88011810666a42b12f52c55b161d60188'  // channelCreator
const PRIVATE_KEY = 'dafa51109b4d90e3c97077a6e4fc1380312bff37dbb533ab80a8d24a7b564b64'  // user

console.log(new Wallet(PRIVATE_KEY).address)
console.log(new Wallet(PRIVATE_KEY2).address)

const generateIdentity = async (privateKey) => {
  const signer = new Wallet(privateKey);

  const header = {
      alg: 'ES256',
      typ: 'JWT'
  };

  const encodedHeader = utils.base64.encode(Buffer.from(JSON.stringify(header)));

  const address = await signer.getAddress();
  const did = `did:ethr:${address}`;

  // const provider = new providers.JsonRpcProvider('https://volta-rpc.energyweb.org')
  // const blockNumber = await provider.getBlockNumber()

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
