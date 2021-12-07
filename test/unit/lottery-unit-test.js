const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployMocks } = require("../../scripts/helpful-scripts");
const { networkConfig } = require("../../helper-hardhat-config");

let mockLinkTokenAddress
let mockLinkToken
let mockV3AggregatorAddress
let vrfCoordinatorMockAddress


describe("Lottery Unit Test", function () {

  before(async function () {
    ({
      mockLinkTokenAddress,
      mockLinkToken,
      mockV3AggregatorAddress,
      vrfCoordinatorMockAddress
    } = await deployMocks())
  });

  beforeEach(async function () {
    // Deploy Lottery
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

    // Fund Lottery
    const linkTransferTx = await mockLinkToken.transfer(lottery.address, 1)
    await linkTransferTx.wait()
    console.log("Successfully funded link")
  });

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
