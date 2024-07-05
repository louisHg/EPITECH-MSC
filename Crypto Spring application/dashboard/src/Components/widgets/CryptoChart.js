import React from 'react';
import "./CryptoChart.css"

export default class CryptoChart extends React.Component {
  state = {
    data:''
  }

  componentDidMount() {
    this.callAPI() 
    this.interval = setInterval(()=> {
        this.callAPI();
        console.log("updated CryptoChart")
    },30000)
}
componentWillUnmount(){
    clearInterval(this.interval)
}

  async callAPI(){
    await fetch(`http://localhost:8081/api/allcoins`)
      .then((res)=>res.text())
      .then((res)=>this.setState({data : JSON.parse(res)}))
  }

  createRows(props){
    
    for(let i = 0;i < props.data.coins.length ; i++){
      if(this.props.coin === props.data.coins[i].uuid){
        var bonusCoin = props.data.coins[i]
      }
    }
    props = props.data.coins.slice(0,10)
    var checkDouble = false

    for(let i = 0 ; i < props.length ; i++){
      if(props[i].uuid === this.props.coin){
        checkDouble = true
      }
    }
    if(!checkDouble){
      props = props.slice(0,9)
      props.push(bonusCoin)
    }

    return props.map((coin)=> {
      return <tr className="coinList" key={coin.uuid}>
          <td className="coinList">{coin.rank}</td>
          <td className="coinList">{coin.symbol}</td>
          <td className="coinList">{coin.price}</td>
          <td className="coinList">{coin.change} %</td>
          <td className="coinList">{coin.marketCap} $</td>
      </tr>
      })
  }

  render() {
    return (
      <div className='tenBest'>

        <table className="Table">
                <thead>
                    <tr>
                        <th className='TableHead'>Rank</th>
                        <th className='TableHead'>Symbol</th>
                        <th className='TableHead'>Price</th>
                        <th className='TableHead'>Change in %</th>
                        <th className='TableHead'>Market Cap</th>
                    </tr>
                </thead>
                <tbody>
                  {this.state.data? this.createRows(this.state.data):null}
                </tbody>
            </table>
      </div>
    )
  }
}