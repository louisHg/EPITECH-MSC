import React from 'react';
import {ReactComponent as Logo} from '../../assets/logo.svg'
import {ReactComponent as Logo2} from '../../assets/9576189.svg'
import {Link} from 'react-router-dom'
import './login.css';

var Coins_name  = require("./coins_name.json")

class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            pwd:"",

            data:"",

            cryptoYesNo:false,
            redditYesNo:false,
            youtubeYesNo:false,
            meteoYesNo:false,
            
            cryptoChartYesNo:false,
            cryptoDataYesNo:false,
            redditThreadsYesNo: false,
            redditSubDataYesNo:false,
            youtubeChannelYesNo:false,
            youtubeSearchYesNo:false,

            coins:'',
            city:'',
            subreddit:'',
            youtubeChannel:'',
            youtubeSearch:'',

            coinEntered:'',
            coinFiltered:'',
            cityEntered:'',
            cityFiltered:'',

        };
    }

    setCrypto = ()=> {
        if(this.state.cryptoYesNo){
            this.setState({cryptoYesNo : false})
        }
        else{
            this.setState({cryptoYesNo : true})
        }
    }
    setReddit = ()=> {
        if(this.state.redditYesNo){
            this.setState({redditYesNo : false})
        }
        else{
            this.setState({redditYesNo : true})
        }
    }
    setYoutube = ()=> {
        if(this.state.youtubeYesNo){
            this.setState({youtubeYesNo : false})
        }
        else{
            this.setState({youtubeYesNo : true})
        }
    }


    setCryptoChart = ()=> {
        if(this.state.cryptoChartYesNo){
            this.setState({cryptoChartYesNo : false})
        }
        else{
            this.setState({cryptoChartYesNo : true})
        }
    }
    setCryptoData = () =>{
        if(this.state.cryptoDataYesNo){
            this.setState({cryptoDataYesNo : false})
        }
        else{
            this.setState({cryptoDataYesNo : true})
        }
    }
    setMeteo = () =>{
        if(this.state.meteoYesNo){
            this.setState({meteoYesNo : false})
        }
        else{
            this.setState({meteoYesNo : true})
        }
    }
    setRedditThreads = () =>{
        if(this.state.redditThreadsYesNo){
            this.setState({redditThreadsYesNo : false})
        }
        else{
            this.setState({redditThreadsYesNo : true})
        }
    }
    setRedditSubData = () =>{
        if(this.state.redditSubData){
            this.setState({redditSubData : false})
        }
        else{
            this.setState({redditSubData : true})
        }
    }
    setYoutubeChannel = () =>{
        if(this.state.youtubeChannelYesNo){
            this.setState({youtubeChannelYesNo : false})
        }
        else{
            this.setState({youtubeChannelYesNo : true})
        }
    }
    setYoutubeSearch = () =>{
        if(this.state.youtubeSearchYesNo){
            this.setState({youtubeSearchYesNo : false})
        }
        else{
            this.setState({youtubeSearchYesNo : true})
        }
    }

    handleFilterCoin = (event) =>{

        var searchedWord = event.target.value;
        this.setState({coinEntered:searchedWord});

        var coinFilter = Coins_name.filter((value=>{
            return value.name.toLowerCase().includes(searchedWord.toLowerCase());
        }));
        if(searchedWord === ""){
            this.setState({coinFiltered : ''})
        }
        else{
            this.setState({coinFiltered : coinFilter});
            this.setState({coinEntered:""});
        }
    }
    handleChange = (e) =>{
        const {name,value} = e.target
        console.log({name,value});
        this.setState({[name]:value})
    }
    handleSubmit = async (e) =>{
        e.preventDefault()
        this.addUser()            
    }
    HandleClickCoin = (coinName) =>{
        document.getElementById("inputCrypto").value = coinName;
        this.setState({coins : coinName});
    }

    async addUser(){

        for(var i = 0; i<Coins_name.length;i++){
            console.log()
            if(this.state.coins === Coins_name[i].name){
                var coinID = Coins_name[i].uuid;
            }
        }

        await fetch("http://localhost:8081/api/new_user",{
            method:'POST',
            body:JSON.stringify({
                'password':this.state.pwd,
                'username':this.state.email,
                'enabledFeatures':{
                    'meteo':{
                        'city':this.state.city,
                        'enabled':this.state.meteoYesNo
                    },
                    'crypto':{
                        'coins':coinID,
                        'cryptoChart':this.state.cryptoChartYesNo,
                        'cryptoGraph': this.state.cryptoDataYesNo,
                    },
                    'reddit':{
                        'subreddit':this.state.subreddit,
                        'subData' : this.state.redditSubDataYesNo,
                        'subThreads' : this.state.redditThreadsYesNo,  
                    },
                    'youtube':{
                        'youtubeChannel': {
                            "channel" : encodeURI(this.state.youtubeChannel),
                            "enabled" : this.state.youtubeChannelYesNo
                        },
                        'youtubeSearch' : {
                            "search" : encodeURI(this.state.youtubeSearch),
                            "enabled" : this.state.youtubeSearchYesNo
                        }
                    }
                }
            })
        })
        .then(()=>{window.location.replace("http://localhost:8080")})
    }
    render(){
        return(
            
            <div className='body'>
                
            <Logo/>
            <div className="main"> 
                
                <input type="checkbox" id="chk" aria-hidden="true"/>

                    <div className="signup">
                    <form onSubmit = {this.handleSubmit}>
                        <Link to="/" className="link">
                            <label htmlFor="chk" aria-hidden="true">Switch to login</label>
                        </Link>
                        <input type='email' name='email' placeholder='email...' required onChange={this.handleChange}/>
                        <input type='password' name='pwd' placeholder='password...' required onChange={this.handleChange}/>

                        <div className='cryptoRegister'>
                            <label htmlFor="cryptoYesNo" aria-hidden="true" className='options'>Crypto</label>
                            <input type='checkbox' name='cryptoYesNo'  className='options' onChange={this.setCrypto}/>
                            {this.state.cryptoYesNo?
                            <div>
                                <label htmlFor="cryptoData" aria-hidden="true" className='options'>Chart</label>
                                <input type='checkbox' name='cryptoData'  className='options' onChange={this.setCryptoData}/>

                                <label htmlFor="cryptoChart" aria-hidden="true" className='options'>Graph</label>
                                <input type='checkbox' name='cryptoChart'  className='options' onChange={this.setCryptoChart}/>

                                <label htmlFor='coins' aria-hidden="true">Enter a cryptocurrency</label>
                                <input type='text' name="coins"  className='options' onChange={this.handleFilterCoin} id='inputCrypto'/>
                            </div>:null}
    
                            {this.state.coinFiltered.length!==0 &&(
                                <div className="dataResult">{Coins_name? this.state.coinFiltered.map((value,key)=>{
                                    return <div className="dataItem"><button onClick={()=>{this.HandleClickCoin(value.name);this.setState({coinFiltered:''})}} id={value.name}>{value.name}</button> </div>}):null}
                                </div>
                            )}
                        </div>

                        <div className='meteoRegister'>
                            <label htmlFor="meteoYesNo" aria-hidden="true" className='options'>Meteo</label>
                            <input type='checkbox' name='meteoYesNo'  className='options' onChange={this.setMeteo}/>
                            {this.state.meteoYesNo?
                            <div>
                                <label htmlFor='city' aria-hidden="true">Enter a city</label>
                                <input type='text' name="city"  className='options' onChange={this.handleChange} id='inputCity'/>
                            </div> :null}
                        </div>
                        
                        <div className='redditRegister'>
                            <label htmlFor="redditYesNo" aria-hidden="true" className='options'>Reddit</label>
                            <input type='checkbox' name='redditYesNo'  className='options' onChange={this.setReddit}/>
                            {this.state.redditYesNo? 
                            <div>
                                <label htmlFor="redditSub" aria-hidden="true" className='options'>Subreddit data</label>
                                <input type='checkbox' name='redditSub'  className='options' onChange={this.setRedditSubData}/>

                                <label htmlFor="redditThreads" aria-hidden="true" className='options'>Subreddit Threads</label>
                                <input type='checkbox' name='redditThreads'  className='options' onChange={this.setRedditThreads}/>

                                <label htmlFor="subreddit" aria-hidden="true">Enter a subreddit</label>
                                <input type='text' name="subreddit" className='options' onChange={this.handleChange}/>
                            </div>
                            :null}                            
                        </div>
                        
                        <div className='youtubeRegister'>
                           <label htmlFor="youtubeYesNo" aria-hidden="true" className='options'>Youtube</label>
                            <input type='checkbox' name='youtubeYesNo'  className='options' onChange={this.setYoutube}/>
                            {this.state.youtubeYesNo? 
                            <div>
                                <label htmlFor="youtubeChannel" aria-hidden="true" className='options'>Youtube Channel</label>
                                <input type='checkbox' name='youtubeChannel'  className='options' onChange={this.setYoutubeChannel}/>
                                {this.state.youtubeChannelYesNo? 
                                <div>
                                    <label htmlFor='youtubeChannel' aria-hidden="true">Enter a youtube channel url</label>
                                    <input type='text' name="youtubeChannel" className='options' onChange={this.handleChange}/>
                                </div>
                                :null}
                                <label htmlFor="youtubeSearch" aria-hidden="true" className='options'>Youtube Search</label>
                                <input type='checkbox' name='youtubeSearch'  className='options' onChange={this.setYoutubeSearch}/>
                                {this.state.youtubeSearchYesNo? 
                                <div>
                                    <label htmlFor='youtubeSearch' aria-hidden="true">Enter a your Youtube Search</label>
                                    <input type='text' name="youtubeSearch" className='options' onChange={this.handleChange}/>
                                </div>
                                :null}
                            </div>
                            :null} 
                        </div>
                        <button id="buttonRegister" onSubmit={this.handleSubmit}>Register and log in</button>
                        
                    </form>
                    </div>
            </div>
            <Logo2/>
        </div>
        )
    }
}

export default Register;