const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundme
          let deployer
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              //await deployments.fixture(["all"])
              fundme = await ethers.getContract("FundMe", deployer)
          })

          it("allows people to fund and withdraw", async () => {
              await fundme.fund({ value: sendValue })
              await fundme.withdraw()
              const endingBalance = await fundme.provider.getBalance(
                  fundme.address
              )
              assert.equal(endingBalance.toString(), "0")
          })
      })
