import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      ethBalance: "0"
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
    console.log(this.state.ethBalance)
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

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
             
                <h1>Dapp University Starter Kit</h1>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
