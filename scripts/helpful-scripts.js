const hre = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

async function deployMocks() {
  // ---------- Mock Link Token
  const MockLinkToken = await hre.ethers.getContractFactory("LinkToken");
  const mockLinkToken = await MockLinkToken.deploy();
  await mockLinkToken.deployed();
  console.log("MockLinkToken deployed at address", mockLinkToken.address)

  // ---------- Mock Oracle
  const MockOracle = await hre.ethers.getContractFactory("MockOracle");
  const mockOracle = await MockOracle.deploy(mockLinkToken.address);
  await mockOracle.deployed();
  console.log("MockOracle deployed at address", mockOracle.address)


  // ---------- Mock V3 Aggregator
  DECIMALS = 8
  INITIAL_VALUE = 200000000000 // This is 2,000

  const MockV3Aggregator = await hre.ethers.getContractFactory("MockV3Aggregator");
  const mockV3Aggregator = await MockV3Aggregator.deploy(DECIMALS, INITIAL_VALUE);
  await mockV3Aggregator.deployed();
  console.log("MockV3Aggregator deployed at address", mockV3Aggregator.address)

  // ---------- Mock VRF Coordinator
  const VRFCoordinatorMock = await hre.ethers.getContractFactory("VRFCoordinatorMock");
  const vrfCoordinatorMock = await VRFCoordinatorMock.deploy(mockLinkToken.address);
  await vrfCoordinatorMock.deployed();
  console.log("VRFCoordinatorMock deployed at address", vrfCoordinatorMock.address)

  return {
    mockLinkTokenAddress: mockLinkToken.address,
    mockLinkToken: mockLinkToken,
    mockV3AggregatorAddress: mockV3Aggregator.address,
    vrfCoordinatorMockAddress: vrfCoordinatorMock.address,
    vrfCoordinatorMock: vrfCoordinatorMock
  }
}

async function deployHardhat() {
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
}

async function deployTestnet() {
  const networkName = hre.network.name
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

module.exports = {
  deployMocks,
  deployHardhat,
  deployTestnet
}