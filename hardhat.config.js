require('dotenv').config()

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-truffle5");
require('hardhat-docgen');
require('hardhat-deploy');
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-gas-reporter");

require('dotenv').config();
const {
    BSCSCAN_API_KEY,
    MNEMONIC,
} = process.env;


module.exports = {
  plugins: [
    'truffle-plugin-verify'
  ],
  defaultNetwork: "hardhat",
  networks: {
    development : {
      url: "http://127.0.0.1:8545",              
      network_id: "*",  
      gasPrice: 20000000000,
      accounts: {mnemonic: 'wave inner country civil fan ribbon imitate slush course broom legend egg'}
    },
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: MNEMONIC}
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 10000000000,
      accounts: {mnemonic: MNEMONIC}
    }
  },
  etherscan: { apiKey: BSCSCAN_API_KEY },
  solidity: {
    compilers: [
        {
          version: "0.8.9",
          settings: {
            optimizer: {
              enabled: false,
              runs: 200,
            },
            metadata: {
              bytecodeHash: "none",
            },
          },
        },
        {
          version: "0.8.0",
          settings: {
            optimizer: {
              enabled: false,
              runs: 200,
            },
            metadata: {
              bytecodeHash: "none",
            },
          },
        }
      ], 
  },
  paths: {
    sources: "contracts",
  },
  gasReporter: {
    currency: 'USD',
    enabled: (process.env.REPORT_GAS === "true") ? true : false
  },
  mocha: {
    timeout: 200000
  }
}