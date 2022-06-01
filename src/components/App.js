import React, { Component } from 'react';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';

import Navbar from './Navbar';
import Main from './Main';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      loading: true,
      token: {},
      ethSwap: {},
      ethBalance: "0",
      tokenBalance: "0"
    }
  }

  async componentWillMount() {
    await this.loadWeb3();
    // import all of the data that we need that's currently stored inside the blockchain
    await this.loadBlockchainData();
    // console.log(window.web3);
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    // this gets teh account connected to metamask
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Get the account's ether balance
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    // console.log(this.state.ethBalance);

    // Load token
    // get the network id (e.g. 5777 for Ganache)
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      // console.log(token);
      this.setState({token});
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      // console.log('TOken balance', tokenBalance.toString());
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      //
      window.alert('Token contract not deployed to detected network.')
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      console.log(ethSwap);
      this.setState({ethSwap});
    } else {
      //
      window.alert('EthSwap contract not deployed to detected network.')
    }    

    this.setState({ loading: false});
  }

  // pull ethereum provider from metamask and expose it to our application
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({loading: true});
    this.state.ethSwap.methods.buyTokens()
      .send({ value: etherAmount, from: this.state.account})
      .on('transactionHash', (hash) => {
        this.setState({loading: false});
      });
  }

  sellTokens = (tokenAmount) => {
    this.setState({loading: true});
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount)
      .send({from: this.state.account})
      .on('transactionHash', (hash) => {
        this.setState({loading: false});
      });
      
    this.state.ethSwap.methods.sellTokens(tokenAmount).send({from: this.state.account})
    .on('transactionHash', (hash) => {
      this.setState({loading: false});
    });
  }

  render() {
    let content;
    if (this.state.loading) {
      content = <p id="loader" className='text-center'>Loading...</p>
    } else {
      content = <Main 
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
             
               {content}
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
