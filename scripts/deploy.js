const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("StakeTracker");
  const deployed = await Contract.deploy();
  await deployed.waitForDeployment(); // ✅ v6 version of .deployed()
  const address = await deployed.getAddress();
  console.log(`Contract deployed at: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
