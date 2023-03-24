const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
// const helperConfig = require ("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig
module.exports.default = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //when going for localhost or hardhat network we want to use a mock
    let ethUsdPriceFeedAddress
    if (chainId == "31337") {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const fundme = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (chainId != "31337" && process.env.etherscan_api_key) {
        await verify(fundme.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.default.tags = ["all", "fundme"]
