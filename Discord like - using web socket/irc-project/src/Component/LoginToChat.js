import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import "./LoginToChat.css";

//const API_ADRESS = 'http://10.26.112.182:9000';

class LoginToChatProxy extends React.Component {
  state = {
    username: this.props.username(),
    userId: this.props.userId(),
  };

  componentDidMount() {
    this.setState({ username: this.props.username() });
    this.setState({ userId: this.props.userId() });
  }

  chooseUsername() {
    this.setState(
      { username: document.getElementById("inputUsername").value },
      () => {
        this.setState({ userId: this.guid() }, () => {});
      }
    );
  }
  guid() {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
  render() {
    return (
      <div className="LoginToChat">
        <div>
          {this.state.username === "" || this.state.username === undefined ? (
            <div>
              <Link to="/" className="link">
                <p1>JAVAX</p1>
              </Link>
              <p3 htmlFor="inputUsername">Input a username : </p3>
              <input type="text" className="input" id="inputUsername" />
              <button onClick={() => this.chooseUsername()}>
                Choose username and enter the chat
              </button>
            </div>
          ) : (
            <div>
              <Link to="/" className="link">
                <p1>JAVAX</p1>
              </Link>
              <p4>Username : {this.state.username}</p4>
              <Chat
                username={this.state.username}
                userId={this.state.userId}
                isLog={this.props.isLog}
                favorites={this.props.favorites}
                navigation={this.props.navigation}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

function LoginToChat(props) {
  var navigation = useNavigate();
  return (
    <LoginToChatProxy
      isLog={props.isLog}
      userId={props.getUserId}
      username={props.getUsername}
      favorites={props.getFavorites}
      setUsername={props.setUsername}
      setUserId={props.setUserId}
      navigation={navigation}
    />
  );
}

export default LoginToChat;
