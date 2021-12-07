const hre = require("hardhat");
const { deployHardhat, deployTestnet } = require("./helpful-scripts");

async function main() {
  const networkName = hre.network.name

  if (networkName === "hardhat") 
    await deployHardhat()
   else 
    await deployTestnet()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
