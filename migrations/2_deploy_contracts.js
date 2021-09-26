const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')


// Everytime you deploy a contract in the blockchain, then you are going to spend a fee (Gas_Fee, Some_ETH)
module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Deploy Dapp Token
  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  // console.log(dappToken.address)  // This value changes each test
  // console.log(daiToken.address)   // This value changes each test
  const tokenFarm = await TokenFarm.deployed()

  // Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(
    tokenFarm.address
    , '1000000000000000000000000' // 1 000 000 * 10^18... 1 000 000 000 000 000 000 000 000
  )

  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000')
}
