const hre = require("hardhat");

async function main() {

  const name = "WagmiClub";
  const symbol = "WGC";

  const badges = await hre.ethers.deployContract("Badge", [name, symbol]);

  await badges.waitForDeployment();

  console.log( `deployed to ${badges.target}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// deployed to 0xb0a800B22A5F624b9AE4946B85b45bff50e79aA3