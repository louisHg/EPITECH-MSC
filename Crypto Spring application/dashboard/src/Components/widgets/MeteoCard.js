import React from "react"
import "./MeteoCard.css"

export default class MeteoCard extends React.Component {
    state = {
      data:''
    }
  
    componentDidMount() {
      this.callAPI() 
      this.interval = setInterval(()=> {
          this.callAPI();
          console.log("updated meteo")
      },30000)
  }
  componentWillUnmount(){
      clearInterval(this.interval)
  }
  
    async callAPI(){

      await fetch(`http://localhost:8081/api/meteo?ville=`+ this.props.town)
        .then((res)=>res.text())
        .then((res)=>this.setState({data : JSON.parse(res)}))
    }

    render() {
      return (
        <div className='meteo'>
            {this.state.data?(
                <div>
                    Temperature :  {this.state.data.current.temperature }°C <br/>
                    Force du vent(?) : { this.state.data.current.wind_speed }km/h <br/>
                    Humidité : {  this.state.data.current.humidity }% <br/>
                </div>)
                :null}
            
        </div>
      )
    }
  }