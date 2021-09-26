const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')
// TokenFarm_Contract
  // name,
  // owner
  // dappToken
  // daiToken
  // address[] public stakers
  // mapping(address => uint) public stakingBalance;
  // mapping(address => bool) public hasStaked;
  // mapping(address => bool) public isStaking;
  // 
  // constructor(DappToken, DaiToken) public
  // stakeTokens(uint _amount) 
  // unstakeTokens()
  // issueTokens()
  const nothing = 0;
require('chai')
  .use(require('chai-as-promised'))
  .should() 

function tokensToWei(n) {
  return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm

  before(async () => {
	// console.log({
	// 	"owner: ": owner, // Accounts[0] @ Ganache
	// 	"investor: ": investor // Accounts[1] @ Ganache
	// });
    // Load Contracts
    daiToken = await DaiToken.new()
    dappToken = await DappToken.new()
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

    
    // Once again, The goal here is, when investor001 invest/stake in TokenFarm_contract with DaiToken, then investor001 will earn DappToken001
    // - So that TokenFarm_contract has to have DappToken
    // - Investor has to have DaiToken

    // Transfer all Dapp tokensToWei to farm (1 million)
    // TokenFarm has to have DappToken
    await dappToken.transfer(
      tokenFarm.address
      , tokensToWei( // .tokensToWei(n) going to convert n_ether to Wei
      '1000000'
      )
    )

    // Send tokensToWei from owner(Accounts[0] @ Ganache) to investor(Accounts[1] @ Ganache)
    await daiToken.transfer(
	  investor
	  , tokensToWei('100')
	  , { 
	    from: owner // = Accounts[0] @ Ganache
	  }
	)
  })

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token')
    })
    it('has a symbol', async () => {
      const symbol = await daiToken.symbol()
      assert.equal(symbol, 'mDAI')
    })
    it('has a totalSupply', async () => {
      const totalSupply = await daiToken.totalSupply()
      assert.equal(totalSupply, 1000000000000000000000000)
    })
  })

  describe('Dapp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name()
      assert.equal(name, 'DApp Token')
    })
    it('has a symbol', async () => {
      const symbol = await dappToken.symbol()
      assert.equal(symbol, 'DAPP')
    })
    it('has a totalSupply', async () => {
      const totalSupply = await dappToken.totalSupply()
      assert.equal(totalSupply, 1000000000000000000000000)
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Dapp Token Farm')
    })

    it('contract has tokensToWei', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokensToWei('1000000'))
    })
  })

  describe('Farming tokens', async () => {

    it('rewards investors for staking mDai tokensToWei', async () => {
      let result

      // Check investor balance before staking
      result = await daiToken.balanceOf(investor)
      // in the before(async), we decided that investor001 has 100DAI
      assert.equal(result.toString(), tokensToWei('100'), 'investor Mock DAI wallet balance correct before staking')

      // Stake Mock DAI Tokens
      // Before transfer token, an approval is mandatory
      // allowance = array(uint, array(address, uint))
      // mapping(address => mapping(address => uint256)) public allowance
	  //
	  // TokenFarm_ContractAddress is allowed/approved to spend 100tokens from investor001
      await daiToken.approve(
		tokenFarm.address
		, tokensToWei('100')
		, { from: investor }
	  )
      await tokenFarm.stakeTokens(tokensToWei('100'), { from: investor })

      // Check staking result
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokensToWei('0'), 'investor Mock DAI wallet balance correct after staking')

      // Checking the DaiToken in TokenFarm is 100tokens
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokensToWei('100'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokensToWei('100'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

      // Issue Tokens
      await tokenFarm.issueTokens({ from: owner })

      // Check balances after issuance
      result = await dappToken.balanceOf(investor)
      assert.equal(result.toString(), tokensToWei('100'), 'investor DApp Token wallet balance correct affter issuance')

      // Ensure that only onwer can issue tokensToWei
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokensToWei
      await tokenFarm.unstakeTokens({ from: investor })

      // Check results after unstaking
      result = await daiToken.balanceOf(investor)
      assert.equal(result.toString(), tokensToWei('100'), 'investor Mock DAI wallet balance correct after staking')

      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokensToWei('0'), 'Token Farm Mock DAI balance correct after staking')

      result = await tokenFarm.stakingBalance(investor)
      assert.equal(result.toString(), tokensToWei('0'), 'investor staking balance correct after staking')

      result = await tokenFarm.isStaking(investor)
      assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
    })
  })

})
