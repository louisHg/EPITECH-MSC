import React from 'react';
import axios from 'axios';

export default class History extends React.Component {
  state = {
    historyList: []
  }

  componentDidMount() {
    axios.get(`http://localhost:8081/api/singleCoin`, { params: {id:"Qwsogvtv82FCd"}})
      .then(res => { 
        const historyList = res.data.data.history;
        this.setState({ historyList });
      })
  }

  render() {
    return (
      <ul>
        { this.state.historyList.map(history => <li>{ new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(history.timestamp*1000)} { history.price } </li>)}
      </ul>
    )
  }
}