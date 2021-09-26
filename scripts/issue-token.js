const TokenFarm = artifacts.require('TokenFarm')

// The main goal of this file is
// - We want to run the code which is inside TokenFarm.issueTokens()
module.exports = async function(callback) {
  let tokenFarm = await TokenFarm.deployed()

  await tokenFarm.issueTokens()
  // Code goes here...
  console.log("Tokens issued!")
  callback()
}
