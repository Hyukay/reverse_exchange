require("@nomicfoundation/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();

const { INFURA_API_KEY, SEPOLIA_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
          "": ["ast"]
        }
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
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
