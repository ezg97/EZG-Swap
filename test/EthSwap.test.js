const { assert } = require('chai');
const Web3 = require('web3');

/*
const { default: Web3 } = require('web3');
*/
const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    // converts normal numbers to Wei (18 trailing zeros)
    return web3.utils.toWei(n, 'ether');
}

// deployer will represent the one who deployed the blockchain
// investor is the one who is investing
contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap;

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        // Transfer all tokens to EthSwap (1 million)
        await token.transfer(ethSwap.address, tokens('1000000'));
    });

    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            // let token = await Token.new()
            const name = await token.name()
            assert.equal(name, 'EZG Token');
        })
    });

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            // let ethSwap = await EthSwap.new()
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange');
        });

        it('contract has tokens', async () => {
            // let token = await Token.new()
            // let ethSwap = await EthSwap.new()
            // await token.transfer(ethSwap.address, '1000000000000000000000000');
            let balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens('1000000'))
        });
    });

    describe('buyTokens()', async () => {
        let result;

        before(async () => {            
            // Purchase tokens before each example
            // the accounts array is passed as a variable into the contract function above
            result =  await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')});
        });

        // The ether left the investor's account and went to -> ethSwap
        // The token balance for the ethSwap exchange went down because some went to -> the investor
        it("Allows user to instantly purchase tokens from ethSwap for a fixed price", async () => {
            // investor recieved tokens after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'));

            // check ethswap balance after purchase
            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address);
            // should be that many tokens after subtractcing 100
            assert.equal(ethSwapBalance.toString(), tokens('999900'));

            // Check that the ether balance went up
                // getBalance is the function used to check the Euthureum balance
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'));
            
        })
    })
   
});