// migration files take a smart contract and put them on the blockchain
// truffle has "artificates" which are js version of the smart contracts in JSON

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

// had to add "async" because you can't use the await keyword unless your in an asynchronus function
module.exports = async function(deployer) {
    // Deploy token
    await deployer.deploy(Token);
    const token = await Token.deployed();

    // Deploy EthSwap
    await deployer.deploy(EthSwap, token.address);
    const ethSwap = await EthSwap.deployed();

    /*
        if you add a new deploy then you need to reset your truffle migration in the command line (truffle migrate --reset)
        This must be done because smart contract code is immutable, that's the whole point. You put it in the blockchain
        and you cant update it, the only thing you can do is deploy a new copy of it to the blockchain
    */


    // Transfer all tokens to EthSwap (1 million)
    await token.transfer(ethSwap.address, '1000000000000000000000000');

};

