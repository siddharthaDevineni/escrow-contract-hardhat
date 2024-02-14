import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Escrow from "./Escrow.js";
import ABI from "./artifacts/contracts/Escrow.sol/Escrow.json";

const escrAddr = "0xCb6041C7C8AD0328593ecb16cb9B71D00169321e";
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}
function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account, signer, escrows]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.BigNumber.from(document.getElementById("wei").value);

    const contract = new ethers.Contract(escrAddr, ABI.abi, signer);

    console.log("escrowContract address: ", contract.address);

    const escrow = {
      address: contract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        contract.on("Approved", () => {
          document.getElementById(contract.address).className = "complete";
          document.getElementById(contract.address).innerText =
            "✓ It's been approved!";
        });
        console.log("signer address: ", signer);
        await approve(contract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" />
        </label>

        <label>
          Deposit Amount (in Wei)
          <input type="text" id="wei" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
