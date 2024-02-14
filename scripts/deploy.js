const ethers = require("ethers");
require("dotenv").config();

// Escrow address:  0xCb6041C7C8AD0328593ecb16cb9B71D00169321e

async function main() {
  const url = process.env.GOERLI_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(url);
  const artifacts = await hre.artifacts.readArtifact("Escrow");

  const arbiter = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const beneficiary = "0x99f369CaAaB302856420a875E4dd5c97c8113c43";
  const depositAmount = hre.ethers.utils.parseEther("0.003");

  const wallet = new ethers.Wallet(privateKey, provider);

  const factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );

  const escrow = await factory.deploy(arbiter, beneficiary, {
    value: depositAmount,
  });

  console.log("Escrow address: ", escrow.address);

  await escrow.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log("Error: ", e);
    process.exit(1);
  });
