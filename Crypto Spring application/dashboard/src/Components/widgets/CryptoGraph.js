import React from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
  } from "recharts";
import "./CryptoGraph.css"

export default class CryptoGraph extends React.Component {
    state = {
      data:''
    }
  
    componentDidMount() {
      this.callAPI() 
      this.interval = setInterval(()=> {
          this.callAPI();
          console.log("updated CryptoGraph")
      },30000)
  }
  componentWillUnmount(){
      clearInterval(this.interval)
  }
  
    async callAPI(){

      await fetch("http://localhost:8081/api/singleCoin?coin="+this.props.coin)
        .then((res)=>res.text())
        .then((res)=>{
            res=JSON.parse(res)
            for(let i = 0 ; i < res.data.history.length ; i++){
                res.data.history[i].price = Math.trunc(res.data.history[i].price)
            }
            this.setState({data : res})
        })
    }

    formatXAxis(tickItem){
        var a = new Date(tickItem * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year + ' ';
        return time;
    }
    formatYAxis(tickItem){
      return tickItem + " $";
    }

    render() {
      return (
        <div className='CoinEvolution'>
            {this.state.data?(
                <div>
                      <LineChart width={500} height={310} data={this.state.data.data.history} >
                            <XAxis dataKey="timestamp" tickFormatter={this.formatXAxis}/>
                            <YAxis dataKey = "price" domain={["dataMin","dataMax"]} tickFormatter={this.formatYAxis}/>
                            <CartesianGrid/>
                            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                        </LineChart>
                </div>)
                :null}
            
        </div>
      )
    }
  }