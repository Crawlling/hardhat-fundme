const { run } = require("hardhat")
async function verify(contractAddress, args) {
    //https://api-goerli.etherscan.io/
    //0x13Bc19A4A404C5a83B95302eb0E4A75172D1FDC5
    console.log("Verifying contract.....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
