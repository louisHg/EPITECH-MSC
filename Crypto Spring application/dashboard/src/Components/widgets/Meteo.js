import React from 'react';
import axios from 'axios';
import { Fragment } from 'react';

export default class Meteo extends React.Component {
  state = {
    meteoList: []
  }
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    axios.get(`http://localhost:8081/api/meteo`, { params: {ville:this.props.name}})
      .then(res => { 
        const meteoList = res.data;
        this.setState({ meteoList: [meteoList] });
      })
    }

  render() {
    return (
       <div>  { this.state.meteoList.map (meteo => (
        <Fragment key="1">
          <div> Temperature : { meteo.current.temperature }°C </div>
          <div> Force du vent(?) : { meteo.current.wind_speed }km/h</div>
          <div> Humidité : { meteo.current.humidity }%</div>
        </Fragment>
       ))} </div>
    )
  }
}