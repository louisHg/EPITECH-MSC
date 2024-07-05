import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./CreateChat.css";

//const API_ADRESS = 'http://10.26.112.182:9000';
const API_ADRESS = "http://localhost:5000";

class CreateChatProxy extends React.Component {
  state = {
    data: "",
    chatName: "",
    passwordYesNo: false,
    password: "",
    publicYesNo: true,
    username: "",
    creationError: "",
  };

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

  handleSubmit = (e) => {
    e.preventDefault();
    this.createChat();
  };

  async createChat() {
    if (
      (this.props.username() === undefined &&
        this.state.username.length === 0) ||
      this.state.chatName.length === 0 ||
      (this.state.passwordYesNo && this.state.password.length === 0)
    ) {
      if (
        this.props.username() === undefined &&
        this.state.username.length === 0
      ) {
        this.setState({ creationError: "No username chosen." });
      }
      if (this.state.chatName.length === 0) {
        this.setState({ creationError: "No name chosen for the chat." });
      }
      if (this.state.passwordYesNo && this.state.password.length === 0) {
        this.setState({ creationError: "No password chosen for the chat." });
      }
    } else {
      var userId;
      var username;

      if (this.props.isLog()) {
        userId = this.props.userId();
        username = this.props.username();
      } else {
        userId = this.guid();
        username = this.state.username;
      }

      this.props.setUsername(username);
      this.props.setUserId(userId);

      await axios
        .post(API_ADRESS + "/api/chat/create_chat", {
          creator_id: userId,
          chat_name: this.state.chatName,
          public: this.state.publicYesNo,
          password: {
            enabled: this.state.passwordYesNo,
            password: this.state.password,
          },
        })
        .then((res) => this.props.navigate("/chat?id=" + res.data));
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    this.setState({ [name]: value });
  };

  handlePassword = (e) => {
    if (this.state.passwordYesNo) {
      this.setState({ passwordYesNo: false });
    } else {
      this.setState({ passwordYesNo: true });
    }
  };

  render() {
    return (
      <div className="createChat">
        <div className="center">
          <form>
            <Link to="/" className="link">
              <p1>JAVAX</p1>
            </Link>
            {!this.props.isLog() ? (
              <div>
                <label className="message_create" htmlFor="username">
                  Username
                </label>
                <input
                  placeholder="Nom du chat"
                  name="username"
                  onChange={this.handleChange}
                  className="input_create"
                  required
                ></input>
              </div>
            ) : null}
            <label className="message_create" htmlFor="chatName">
              Chat name
            </label>
            <input
              placeholder="Chat room name"
              name="chatName"
              onChange={this.handleChange}
              className="input_create"
              required
            ></input>
            {!this.props.isLog ? (
              <p>
                As you're not connected, you wont be the channel admin once you
                disconnect.
              </p>
            ) : null}
            <input
              className="button"
              type="submit"
              onClick={this.handleSubmit}
            />
            {this.state.creationError ? (
              <p>{this.state.creationError}</p>
            ) : null}
          </form>
        </div>
      </div>
    );
  }
}

function CreateChat(props) {
  const navigate = useNavigate();
  return (
    <CreateChatProxy
      isLog={props.isLog}
      userId={props.userId}
      username={props.username}
      setUsername={props.setUsername}
      setUserId={props.setUserId}
      navigate={navigate}
    />
  );
}

export default CreateChat;
