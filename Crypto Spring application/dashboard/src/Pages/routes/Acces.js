import React from 'react';
import {Switch,Route} from 'react-router-dom'
import Topbar from "../../Components/topbar/Topbar"
import NewHome from '../Home/Home'
import Sidebar from "../../Components/sidebar/Sidebar"
import "./App.css"
import Weather from "../weather/Weather"
import Sale from "../sales/Sales"
import BTC1 from "../BTC1/BTC1"
import BTC2 from "../BTC2/BTC2"
import Villes from "../villes/Villes"

function Home(props){
    return(
        <div>
            <Topbar isLogged={props.handleLogged}/>   
            <div className='container'>
                <Sidebar isLogged={props.handleLogged}/>
                <Switch>
                    <Route exact path='/'><NewHome username={props.username.username}/></Route>
                    <Route path='/weathers/:name' component={Weather}/>
                    <Route path='/sales' component={Sale}/>
                    <Route path='/BTC1' component={BTC1}/>
                    <Route path='/BTC2' component={BTC2}/>
                    <Route path='/villes' component={Villes}/>
                </Switch>
            </div>
        </div>
    )
}

export default Home;