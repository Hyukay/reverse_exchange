
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter')
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */

const { INFURA_API_KEY, SEPOLIA_PRIVATE_KEY } = process.env;

module.exports = {

  solidity: "0.8.17",
  defaultNetwork: "sepolia",
  networks : {
    hardhat: {},
    sepolia: {
      url: INFURA_API_KEY,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`]
      }
    },
     mocha: {
      timeout: 120000
  }
}
