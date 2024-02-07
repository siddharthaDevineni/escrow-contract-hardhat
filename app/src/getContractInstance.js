// import { hre } from "hardhat";
import { ethers } from "ethers";

export default async function getContractInstance() {
  let escrowContract = await ethers.getContractAt(
    "Escrow",
    "0xC92671A8f7f33E379f0AC88749A6Aba8058541be",
    "0xE5D66682f152b630EdD3c55499F27dA14c18cBB6"
  );
  return escrowContract;
}
