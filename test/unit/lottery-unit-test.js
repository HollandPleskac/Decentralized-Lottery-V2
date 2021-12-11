const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployMocks } = require("../../scripts/helpful-scripts");
const { networkConfig } = require("../../helper-hardhat-config");

let mockLinkTokenAddress
let mockLinkToken
let mockV3AggregatorAddress
let vrfCoordinatorMockAddress
let vrfCoordinatorMock
let lottery

const DECIMALS = ethers.BigNumber.from(10).pow(18)


describe("Lottery Unit Test", function () {

  before(async function () {
    ({
      mockLinkTokenAddress,
      mockLinkToken,
      mockV3AggregatorAddress,
      vrfCoordinatorMockAddress,
      vrfCoordinatorMock
    } = await deployMocks())
  });

  beforeEach(async function () {
    // Deploy Lottery
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(mockV3AggregatorAddress, vrfCoordinatorMockAddress, mockLinkTokenAddress, networkConfig["hardhat"].fee, networkConfig["hardhat"].keyHash);

    await lottery.deployed();

    console.log("Lottery deployed at address", lottery.address)

    // Fund Lottery
    const linkTransferTx = await mockLinkToken.transfer(lottery.address, ethers.BigNumber.from(1).mul(DECIMALS))
    await linkTransferTx.wait()
    console.log("Successfully funded link")
  });

  it("can't enter lottery unless started", async function () {
    const options = { value: ethers.utils.parseEther("0.1") }
    await expect(lottery.enterLottery(options))
      .to.be.revertedWith("Can't enter a closed lottery, lottery must be open");
  })

  it("can't enter lottery unless user enters more than $50 in ETH", async function () {
    const startLotteryTx = await lottery.startLottery()
    await startLotteryTx.wait()

    // 1 ETH = 2000 USD
    // 50 USD = 0.025 ETH
    const badEntranceFee = "0.020"
    const options = { value: ethers.utils.parseEther(badEntranceFee) }
    console.log("options.value", options.value)
    await expect(lottery.enterLottery(options))
      .to.be.revertedWith("Need to send $50 or more in ETH");
  })

  it("can enter lottery when started", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const startLotteryTx = await lottery.startLottery()
    await startLotteryTx.wait()

    const options = { value: ethers.utils.parseEther("0.1") }
    const enterLotteryAcc1Tx = await lottery.enterLottery(options)
    const enterLotteryAcc2Tx = await lottery.connect(addr1).enterLottery(options)

    expect(await lottery.participants(0)).to.equal(owner.address)
    expect(await lottery.participants(1)).to.equal(addr1.address)

  })

  it("can't pick winner unless participants are in the lottery", async function () {
    // Start Lottery
    const startTx = await lottery.startLottery()
    await startTx.wait()
      
    //DONT ENTER PARTICIPANTS

    await expect(lottery.endLottery()).to.be.revertedWith("Must have participants to pick a winner");
  })

  it("can pick winner correctly", async function () {
    const [owner, addr1] = await ethers.getSigners();

    // Start Lottery
    const startTx = await lottery.startLottery()
    await startTx.wait()

    // Enter participants
    const options = { value: ethers.utils.parseEther("0.1") }
    const enterLotteryAcc1Tx = await lottery.enterLottery(options)
    const enterLotteryAcc2Tx = await lottery.connect(addr1).enterLottery(options)

    // End Lottery
    const endTx = await lottery.endLottery()
    const recipt = await endTx.wait()
    const pickingWinnerEvent = recipt.events.find(el => el.event === "PickingWinner")
    // console.log("picking winner event", pickingWinnerEvent)
    const requestId = pickingWinnerEvent.args.requestId
    console.log("req id", requestId)

    // Mock random number callback
    const randomnessCallbackTx = await vrfCoordinatorMock.callBackWithRandomness(requestId, 3, lottery.address)
    await randomnessCallbackTx.wait()

    // Get last winner
    const lastWinner = await lottery.lastWinner()
    console.log("lastWinner: ", lastWinner);

    expect(lastWinner).to.equal(addr1.address);
  })
});
