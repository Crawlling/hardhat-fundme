const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe("FundMe", async function () {
          let fundme
          let deployer
          let MockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundme = await ethers.getContract("FundMe", deployer)
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function () {
              it("set the aggregator addresses correctly", async function () {
                  const response = await fundme.getPricefeed()

                  assert.equal(response, MockV3Aggregator.address)
              })
          })

          describe("fund", async () => {
              it("Fail if you don't send enough ETH", async () => {
                  await expect(fundme.fund()).to.be.revertedWith(
                      "Didn't sent enough."
                  )
              })
              it("updated the amount funded data structure", async () => {
                  await fundme.fund({ value: sendValue })

                  const response = await fundme.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })

              it("Adds funder to array of funders", async () => {
                  await fundme.fund({ value: sendValue })
                  const funder = await fundme.getFunders(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundme.fund({ value: sendValue })
              })

              it("withdraw Eth from a single founder", async () => {
                  //Arrange
                  const startingFundMeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act

                  const transactionResponse = await fundme.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  )
              })

              it("allows us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundmeConnectContract = await fundme.connect(
                          accounts[i]
                      )
                      fundmeConnectContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act

                  const transactionResponse = await fundme.withdraw()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  // assert.equal(
                  //     startingFundMeBalance.add(startingDeployerBalance).toString(),
                  //     endingDeployerBalance.add(gasCost).toString()
                  // )
                  // console.log(fundme.funders(0))
                  await expect(fundme.getFunders(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      assert.equal(
                          fundme
                              .getAddressToAmountFunded(accounts[i].address)
                              .toString(),
                          0
                      )
                  }
              })

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundme.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundme, "FundMe_NotOwner")
              })

              it("allows us to withdraw_cheaper with multiple funders", async () => {
                  const accounts = await ethers.getSigners()
                  for (let i = 1; i < 6; i++) {
                      const fundmeConnectContract = await fundme.connect(
                          accounts[i]
                      )
                      fundmeConnectContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await fundme.provider.getBalance(fundme.address)
                  const startingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Act

                  const transactionResponse = await fundme.withdraw_cheaper()
                  const transactionReceipt = await transactionResponse.wait(1)

                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const endingFundMeBalance = await fundme.provider.getBalance(
                      fundme.address
                  )
                  const endingDeployerBalance =
                      await fundme.provider.getBalance(deployer)

                  //Assert
                  // assert.equal(
                  //     startingFundMeBalance.add(startingDeployerBalance).toString(),
                  //     endingDeployerBalance.add(gasCost).toString()
                  // )
                  // console.log(fundme.funders(0))
                  await expect(fundme.getFunders(0)).to.be.reverted

                  for (let i = 0; i < 6; i++) {
                      assert.equal(
                          fundme
                              .getAddressToAmountFunded(accounts[i].address)
                              .toString(),
                          0
                      )
                  }
              })
          })
      })
    : describe.skip
