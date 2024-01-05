require("@nomicfoundation/hardhat-toolbox");

require("hardhat-gas-reporter");
require("hardhat-contract-sizer");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  gasReporter: {
    enabled: true,
    currency: "DAI",
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};
