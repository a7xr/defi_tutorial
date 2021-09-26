pragma solidity ^0.5.0;

// This token is already done, so this one will not be commented here anymore
// - so that is DappToken_Contract
// What (we are)/(I am) going to do in this project is commenting the TokenFarm
// Once again, The goal here is, when investor001 invest/stake in TokenFarm_contract with DaiToken, then investor001 will earn DappToken001
contract DaiToken {
    string  public name = "Mock DAI Token";
    string  public symbol = "mDAI";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens: 1 000 000 *10^18... 1000 000 000 000 000 000 000 000
    uint8   public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[
            msg.sender // This is going to have value when calling this function with param ({from:XXX})
            ] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // it is the code below that is going to do the transfer
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        // The msg.sender below is going to be got from the { from: XXX }
        // - if { from: XXX } is not defined, then it is going to be the address of this contract
        // - The toAccount is not defined in this function
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
}
