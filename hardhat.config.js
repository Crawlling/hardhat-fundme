require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("hardhat-gas-reporter")
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    //solidity: "0.8.18",
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    etherscan: {
        apiKey: process.env.etherscan_api_key,
    },
    networks: {
        goerli: {
            url: process.env.goerli_URL,
            accounts: [process.env.private_key],
            chainId: 5,
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        gasPriceApi:
            "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice",
        // coinmarketcap: process.env.coinmarketcap_api_key,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        user: {
            default: 1,
        },
    },
}
