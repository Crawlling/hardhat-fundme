const { developmentChain } = require("../helper-hardhat-config")
const { network } = require("hardhat")
module.exports.default = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    if (chainId == "31337") {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            Contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [8, 1683 * 1e8],
        })
        log("Mocks deployed!")
    }
}

module.exports.default.tags = ["all", "mocks"]
