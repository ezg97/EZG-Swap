pragma solidity ^0.5.0;

import "./Token.sol";
// truffle compile just verifies that there are no syntax errors

// create smart contract
contract EthSwap {
    // state variables can be accessed in other functions and are stored in the blockchain

    // because we want to read this variable name **outside** of the smart contract, we need to make this public so its accessible
    // the data stored in the name variable is stored in the blockhain
    string public name = "EthSwap Instant Exchange";

    // this is just the code for the smart contract, it doesn't actually tell us where it is on the blockchain
    Token public token;

    // for every ether you get 100 EZG tokens
    uint public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    // so we pass the address in on creation
    constructor(Token _token) public {
        // the address doesn't get saved to the blockchain unless we store it to the state variable
        token = _token;
    }

    // public function: can be called outside of the smart contract
    // payable function: that will allow us to send eutheruem wheenver we call this function, without it we can't send ether
    function buyTokens() public payable {
        // write code to purchase tokens
        // transfer tokens from ethSwap cotract to the person whos buying them

        // Redemption rate = # of tokens they recieve for 1 ether
        // Ammount of Ethereum multiplied by the redemtion rate

        // another global variable that tells us how much ether was sent when the function was called
        // Calculate the number of EZG tokens to buy
        uint tokenAmount = msg.value * rate;

        // Require is a statement in solidity, if it evaluates to true it continues the function, otherwise it doesn't complete the function and throws an error
        // Require this exchange has enough tokens: If someone tries to buy more than the exchange has, then it'll fail
        require(token.balanceOf(address(this)) >= tokenAmount);

        //msg is a global variable and sender is the value of the address that's calling this function
        // transfers token to the user (transfer for ERC20 tokens, found in Token.sol)
        token.transfer(msg.sender, tokenAmount);

        // Events are a way of subsribing to events on the blockchain
        // Emit an event when a token was purchased
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);

        // Calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;

        // Require that EthSwap has enough Ether before the sell happens
        require(address(this).balance >= etherAmount);

        // Perform sell
        // using token.transfer(address(this), _amount) wouldn't work because we can't let the smart contract call an erc20 token like this on behalf of the investor
        // otherwise you could hide transfer functions inside of smart contract calls w/o ppl knowing about it
        // to avoid that ERC20 has transferFrom which allows other smart contracts to spend your money
        // the ERC20 approve() function must be called before transferFrom; however, you can call the approve from outside the smart contract before you call "sellTokens()"
        token.transferFrom(msg.sender, address(this), _amount);
        // transfer function for ether (different than the one for erc20)
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}

