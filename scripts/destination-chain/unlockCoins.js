const hre = require("hardhat");
const { ethers } = require("ethers");
const { getContracts, saveContract } = require("../utils");
const axios = require("axios");

async function main() {
  const deployer = await hre.ethers.provider.getSigner(); // Get the signer from provider
  const deployerAddress = await deployer.getAddress();    // Retrieve the address
  console.log('Deploying on', hre.network.name, 'with account', deployerAddress);
  
  const network = hre.network.name;
  const contracts = getContracts(network);

  const UnlockContract = await hre.ethers.getContractFactory(
    "FireERC20"
  );
  const unlockContract = UnlockContract.attach(
    contracts.unlockContract
  );

  const estimateFee = await unlockContract.estimateFee(
    1073741853,
    300000
  );

  // Call the checkBalance function to see if the address you're sending the tokens to
  // has enough coins locked in the source chain
  const unlockAmount = ethers.parseEther("1", 18);

  const tx = await unlockContract.unlockCoins(
    // Source chain Id
    1073741853,
    // Contract address from source chain - Native Coin
    "0x7A0d8C7347D1CFfeB91264fD299BaEC2302990be",
    // Address of the user (Must have native coins locked in the smart contract)
    "0x850b74A3Cd5edeaD1d09c4ce39356ED681709C1c",
    // Amount to be unlock
    unlockAmount,
    // gas limit
    300000,
    // gas fee
    { value: estimateFee }
    );

  console.log("Unlock Transaction initiated");

  await tx.wait();
  console.log("Transaction hash:", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
