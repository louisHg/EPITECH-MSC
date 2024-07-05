import React from 'react';
import {ReactComponent as Logo} from '../../assets/logo.svg'
import {ReactComponent as Logo2} from '../../assets/9576189.svg'
import './login.css';
import {Link} from 'react-router-dom'

class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email:'',
            pwd:"",
            data:"",
        };
    }

    handleChange = (e) =>{
        const {name,value} = e.target
        this.setState({[name]:value})
    }

    handleSubmit = async (e) =>{
        e.preventDefault()
        this.login(this.state.email,this.state.pwd)            
    }

    async login(username,password){
        await fetch("http://localhost:8081/api/login?username=" + username + "&password=" + password)
        .then(res=>res.text())
        .then(res=>this.setState({data : JSON.parse(res)}))
        .then(()=>this.checkLogin(username))
    }
    checkLogin(username){
        if(this.state.data.success === "true"){
            this.props.isLogin({isLog:true})
            this.props.username({username:username})
        }
        else {
            alert("Please verify your informations")
        }
    }

    render(){
        return(
            <div className='body'>
                
                <Logo/>
                <div className="main"> 
                	
                    <input type="checkbox" id="chk" aria-hidden="true"/>
    
                        <div className="signup">
                            <form onSubmit = {this.handleSubmit}>
                                <Link to="*" className="link">
                                    <label htmlFor="chk" aria-hidden="true">Switch to register</label>
                                </Link>
                                <input type='email' name='email' placeholder='email...' required onChange={this.handleChange}/>
                                <input type='password' name='pwd' placeholder='password...' required onChange={this.handleChange}/>
                                <button onSubmit={this.handleSubmit}>Log In</button>
                            </form>
                        </div>
                </div>
                <Logo2/>
            </div>
            
        )
    }
}

export default Login;