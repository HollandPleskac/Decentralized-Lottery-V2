const { expect } = require("chai");
const { ethers } = require("hardhat");
const { networkConfig } = require("../../helper-hardhat-config");

describe("Lottery Unit Test", function () {

  let lottery

  beforeEach(async function () {
    this.timeout(120000);
    const networkName = hre.network.name
    console.log(`Deploying to ${networkName} network`)

    // Deploy Lottery Contract
    const Lottery = await hre.ethers.getContractFactory("Lottery")
    lottery = await Lottery.deploy(
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
  });

  it("can pick winner correctly", async function () {
    this.timeout(300000);
    // Start Lottery
    const startTx = await lottery.startLottery()
    await startTx.wait()
    console.log("started lottery")

    // // Enter participants
    const options = { value: ethers.utils.parseEther("0.05") }
    const enterTx = await lottery.enterLottery(options)
    await enterTx.wait()
    console.log("entered the lottery")

    // End Lottery
    const endTx = await lottery.endLottery()
    await endTx.wait()
    console.log("ended the lottery")

    await new Promise(r => setTimeout(r, 60000));

    // Get last winner
    const lastWinnerData = await lottery.lastWinnerData()
    console.log("lastWinner: ", lastWinnerData.lastWinner)

    const [account] = await ethers.getSigners()
    expect(lastWinnerData.lastWinner).to.equal(account.address)

  })
});
