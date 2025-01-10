require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 200,
    //   },
    // },
  },
  networks: {
    // sepolia: {
    //   url: process.env.API_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
    amoy: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  gas: 2100000,
  gasPrice: 470000000000,
};
