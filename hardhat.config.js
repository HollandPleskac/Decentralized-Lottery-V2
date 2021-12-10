require("@nomiclabs/hardhat-waffle");
require("@appliedblockchain/chainlink-plugins-fund-link")

require('dotenv').config()


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7"
      },
      {
        version: "0.8.4"
      },
      {
        version: "0.6.6"
      },
      {
        version: "0.6.0"
      },
      {
        version: "0.4.24"
      },
      {
        version: "0.4.11"
      }
    ]
  },
  networks: {
    kovan: {
      url: process.env.KOVAN_RPC_URL,
      accounts: [process.env.DEV_ACC_PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.DEV_ACC_PRIVATE_KEY]
    }
  }
};
