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

        //msg is a global variable and sender is the value of the address that's calling this function
        
        token.transfer(msg.sender, tokenAmount);
    }
}

