const networkConfig = {
  hardhat: {
    // linkToken, ethUsdPriceFeed, and vrfCoordinator will be mocks on the hardhat network
    keyHash: '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
    fee: '100000000000000000', // 0.1 LINK
    fundAmount: "1000000000000000000", // 1 LINK
  },
  kovan: {
    linkToken: '0xa36085F69e2889c224210F603D836748e7dC0088',
    ethUsdPriceFeed: '0x9326BFA02ADD2366b30bacB125260Af641031331',
    vrfCoordinator: '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9',
    keyHash: '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
    fee: '100000000000000000', // 0.1 LINK
    fundAmount: "1000000000000000000", // 1 LINK
  },
}

module.exports = {
  networkConfig
}

// TODO : add rinkeby network
// events into lottery
// frontend that interacts with the lottery
// learn how to write tests (1 hr video) do that tmo
// write a bunch of tests