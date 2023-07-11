const { env } = require("process");
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter')

/** @type import('hardhat/config').HardhatUserConfig */

const INFURA_API_KEY = env.INFURA_API_KEY;
const SEPOLIA_PRIVATE_KEY = env.SEPOLIA_PRIVATE_KEY;

module.exports = {

  solidity: "0.8.17",
  networks : {
    sepolia: {
      url: "https://sepolia.infura.io/v3/"`${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
      }
    }
}
