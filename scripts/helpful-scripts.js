const hre = require("hardhat");

async function deployMocks() {
  // ---------- Mock Link Token
  const MockLinkToken = await hre.ethers.getContractFactory("LinkToken");
  const mockLinkToken = await MockLinkToken.deploy();
  await mockLinkToken.deployed();
  console.log("MockLinkToken deployed at address", mockLinkToken.address)

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
  }
}

module.exports = {
  deployMocks
}