import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./log.css";

//const API_ADRESS = 'http://10.26.112.182:9000';
const API_ADRESS = 'http://localhost:5000'

class LoginProxy extends React.Component{
    state = {
        accountName:'',
        password:'',
        id:'',
        data:'',
        loginError:'',
    }

    async LogToAccount(){
        if(this.state.accountName.length === 0 || this.state.password.length === 0){
            if(this.state.accountName.length === 0){
                this.setState({loginError : "No account name entered."})
            }
            if(this.state.password.length === 0){
                this.setState({loginError : "No password name entered."})
            }
        }
        else{
            axios.get(API_ADRESS +"/api/user/login?accountName=" + this.state.accountName + "&password=" + this.state.password)
            .then((res)=> this.setState({data : res.data}))
            .then(()=>this.handleData())
        }
        
    }
    handleChange = (e) =>{
        const {name,value} = e.target
        this.setState({[name]:value})
    }
    handleData(){
        if(this.state.data.status === "successful"){
            console.log(this.state.data)
            this.props.setUsername(this.state.data.username);
            this.props.setUserId(this.state.data._id)
            this.props.setLog(true)
            this.props.setFavorites(this.state.data.saved_channels)
            this.props.navigation("/")
        }
        else{
            this.setState({loginError : this.state.data.error})
        }
    }

    render(){
        return (
          <div>
            <h2 className="message_log">Login</h2>
            <div>
              <label htmlFor="accountName">Account name</label>
              <input
                type="text"
                name="accountName"
                id="accountName"
                className="input"
                required
                onChange={this.handleChange}
              />
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                className="input"
                id="password"
                required
                onChange={this.handleChange}
              />
              <button onClick={() => this.LogToAccount()}>Login</button>
              {this.state.loginError ? <p>{this.state.loginError}</p> : null}
            </div>
          </div>
        );
    }
}

function Login(props) {
    const navigation = useNavigate();
    return (
        <LoginProxy setLog={props.setLog} setUsername={props.setUsername} setUserId={props.setUserId} navigation={navigation} setFavorites={props.setFavorites}/>
    )
}

export default Login;