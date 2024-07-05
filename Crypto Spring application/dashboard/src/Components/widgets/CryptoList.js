import React from 'react';
import axios from 'axios';

export default class CryptoList extends React.Component {
  state = {
    cryptos: []
  }

  componentDidMount() {
    axios.get(`http://localhost:8081/api/listCrypto`)
      .then(res => { 
        const cryptos = res.data;
        this.setState({ cryptos });
      })
  }

  render() {
    return (
      <table>
        { this.state.cryptos.map(crypto => <tr><td><a href={ crypto.fileName }> { crypto.name } </a> </td></tr> )}
      </table>  
    )
  }
}