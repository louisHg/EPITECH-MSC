import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./log.css";

//const API_ADRESS = 'http://10.26.112.182:9000';
const API_ADRESS = 'http://localhost:5000'

class RegisterProxy extends React.Component{
        
    state = {
        accountName:'',
        username:'',
        password:'',
        id:'',
        data:'',
        creationError:'',
    }

    async createAccount(){
        if(this.state.accountName.length === 0 || this.state.password.length === 0 || this.state.username.length === 0){
            if(this.state.accountName.length === 0){
                this.setState({creationError : "No account name entered."})
            }
            if(this.state.password.length === 0){
                this.setState({creationError : "No password name entered."})
            }
            if(this.state.username.length === 0){
                this.setState({creationError : "No username name entered."})
            }
        }
        else{
            console.log(API_ADRESS + "/api/user/register")
            axios.post(API_ADRESS + "/api/user/register",{
                'accountName' : this.state.accountName,
                'username' : this.state.username,
                'password' : this.state.password,
            })
            .then((res)=>this.setState({data : res.data}))
            .then(()=>this.handleData())
        }
    }

    handleData(){
        if(this.state.data.status === "successful"){
            this.props.setUsername(this.state.data.username);
            this.props.setUserId(this.state.data._id)
            this.props.setLog(true)
            this.props.setFavorites([])
            this.props.navigation("/")
        }
        else{
            this.setState({creationError : this.state.data.error})
        }
    }

    handleChange = (e) =>{
        const {name,value} = e.target
        this.setState({[name]:value})
    }

    render(){
        return (
          <div>
            <h2 className="message_log">Register</h2>
            <div>
              <label htmlFor="accountName">Account name</label>
              <input
                type="text"
                name="accountName"
                className="input"
                id="accountName"
                required
                onChange={this.handleChange}
              />
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                className="input"
                required
                onChange={this.handleChange}
              />
              <label htmlFor="password">Password</label>
              <input
                type="text"
                name="password"
                id="password"
                className="input"
                required
                onChange={this.handleChange}
              />
              <button onClick={() => this.createAccount()}>Register</button>
              {this.state.creationError ? (
                <p>{this.state.creationError}</p>
              ) : null}
            </div>
          </div>
        );
    }
}
function Register(props) {
    const navigation = useNavigate();
    return (
        <RegisterProxy setFavorites={props.setFavorites} setLog={props.setLog} setUsername={props.setUsername} setUserId={props.setUserId} navigation={navigation}/>
    )
}

export default Register;