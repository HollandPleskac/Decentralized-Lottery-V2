// This task can potentially mock random numbers on the localhost network
// an error is being thrown on requestRandomness(keyHash, fee); (ln89) in lottery contract
// Pending Question on Stack Overflow : https://stackoverflow.com/questions/70413439/request-randomness-not-working-in-localhost-network-hardhat

task("mock-random-number", "Mocks a random number")
  .addParam("requestid", "request id")
  .addParam("lotteryaddress", "Address of lottery contract")
  .addParam("vrfcoordinatoraddress", "Address of mock vrf coordinator")
  .setAction(async (taskArgs) => {

    const requestId = taskArgs.requestid
    const lotteryAddress = taskArgs.lotteryaddress
    const vrfCoordinatorAddress = taskArgs.vrfcoordinatoraddress
    const [account] = await hre.ethers.getSigners();

    const VRFCoordinatorMock = await hre.ethers.getContractFactory("VRFCoordinatorMock");
    const vrfCoordinatorMock = new hre.ethers.Contract(vrfCoordinatorAddress, VRFCoordinatorMock.interface, account)

    // // Mock random number callback
    const randomnessCallbackTx = await vrfCoordinatorMock.callBackWithRandomness(requestId, 3, lotteryAddress)
    await randomnessCallbackTx.wait()

    console.log("mocking...")
  });

module.exports = {};