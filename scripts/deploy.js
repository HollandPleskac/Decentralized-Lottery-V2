const hre = require("hardhat");
const { deployMocks } = require("./helpful-scripts");
const { networkConfig } = require("../helper-hardhat-config");

async function main() {
  const networkName = hre.network.name

  if (networkName === "hardhat") {
    console.log("Deploying to hardhat network")
    // ---------- Deploy Mock Contracts
    const {
      mockLinkTokenAddress,
      mockLinkToken,
      mockV3AggregatorAddress,
      vrfCoordinatorMockAddress
    } = await deployMocks()

    // ---------- Deploy Lottery Contract
    const Lottery = await hre.ethers.getContractFactory("Lottery")
    const lottery = await Lottery.deploy(
      mockV3AggregatorAddress,
      vrfCoordinatorMockAddress,
      mockLinkTokenAddress,
      networkConfig["hardhat"].fee,
      networkConfig["hardhat"].keyHash
    )
    await lottery.deployed()
    console.log("Lottery deployed at address", lottery.address)

    // ---------- Fund Lottery Contract

    const linkTransferTx = await mockLinkToken.transfer(lottery.address, 1)
    await linkTransferTx.wait()
    console.log("Successfully funded link")

  } else {
    console.log(`Deploying to ${networkName} network`)

    // ---------- Deploy Lottery Contract
    const Lottery = await hre.ethers.getContractFactory("Lottery")
    const lottery = await Lottery.deploy(
      networkConfig[networkName].ethUsdPriceFeed,
      networkConfig[networkName].vrfCoordinator,
      networkConfig[networkName].linkToken,
      networkConfig[networkName].fee,
      networkConfig[networkName].keyHash
    )
    await lottery.deployed()
    console.log("Lottery deployed at address", lottery.address)

    // ---------- Fund Lottery Contract
    await hre.run("fund-link", { contract: lottery.address, linkaddress: networkConfig[networkName].linkToken })
    console.log("Successfully funded link")

  }



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
