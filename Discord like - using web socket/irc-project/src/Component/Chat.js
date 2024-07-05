import axios from "axios";
import React from "react";
import io from "socket.io-client";

import "./Chat.css";

//const API_ADRESS = 'http://10.26.112.182:9000';
const API_ADRESS = "http://localhost:5000";

export default class Chat extends React.Component {
  state = {
    data: "",
    messages: [],
    currentMessage: "",
    socket: "",
    channelID: new URLSearchParams(window.location.search).get("id"),
    alreadyFaved: false,
    favorites: this.props.favorites(),
  };

  componentDidMount() {
    this.callApi().then(() => {
      let socket = io(API_ADRESS);
      this.setState({ socket: socket });

      socket.emit("join", {
        id_user: this.props.userId,
        username: this.props.username,
        channel_id: this.state.channelID,
        channel_name: this.state.data.channel_name,
      });
      socket.on("message", (message) => {
        this.setState({ messages: [...this.state.messages, message]});
      });
      socket.on("banned_kekw", (username) => {
        this.setState({ messages: [...this.state.messages, {"type": "banned_kekw","username" : username.username}] });
      });
      socket.on("joined", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"joined", "username" : username.username}] });
      });
      socket.on("disconnected", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"disconnected", "username" : username.username}] });
      });
      socket.on("octogone", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"octogone", "username_1" : username.username_1, "username_2" : username.username_2}] });
      });
      socket.on("gigachad", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"gigachad", "username" : username.username}] });
      });
      socket.on("jotaro", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"jotaro"}] });
      });
      socket.on("kouisine", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"kouisine"}] });
      });
      socket.on("gyoza", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"gyoza","username" : username.username}] });
      });
      socket.on("coming", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"coming", "username_1" : username.username_1, "username_2" : username.username_2}] });
      });
      socket.on("face_swap", (username) => {
        this.setState({ messages: [...this.state.messages, {"type":"face_swap", "username_1" : username.username, "username_2" : username.new_username}] });
      });
    });
  }

  async callApi() {
    await fetch(API_ADRESS + "/api/chat/get_chat?id=" + this.state.channelID)
      .then((res) => res.text())
      .then((res) => this.handleData(res));
  }
  handleData(res) {
    res = JSON.parse(res);
    this.setState({ data: res });
    this.setState({ messages: res.messages });

    for(let i = 0 ; i < this.state.favorites.length ; i++){
      if(this.state.favorites[i].channel_id === this.state.channelID){
        this.setState({alreadyFaved : true})
      }
    }
  }
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.currentMessage) {
      if (this.state.currentMessage.charAt(0) === "/") {

        var command = this.state.currentMessage.substring(this.state.currentMessage.indexOf("/") + 1).split(" ");
        var command_identifier = command[0];

        switch (command_identifier) {
          case "nick":
            if (command.length > 2) {
              console.log("Trop d'arguments reçus, seulement deux attendus mais en a reçu " + command.length)} 
              else {
                this.changeNickname(command[1])
                this.state.socket.emit("face_swap",() => {
                  document.getElementById("currentMessage").value = "";
                  this.setState({ currentMessage: "" });
            });
              }

            break;

          case "list":
            console.log(command_identifier);
            this.getChannels();
            break;

          case "create":
            this.createNewChannel(command[1])
            break;

          case "delete":
            console.log(command_identifier);
            this.deleteChannel(command[1])
            break;

          case "quit":
            this.props.navigation("/");
            break;

          case "users":
            this.getUsers();
            break;

          case "help":
            this.setState({messages: [...this.state.messages,{"type":"help"}]});
            break;
          

          case "octogone" : 
          this.state.socket.emit("octogone",command[1],() => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;

          case "coming" : 
          this.state.socket.emit("coming",command[1],() => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;
          
          case "gigachad" : 
          this.state.socket.emit("gigachad",() => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;

          case "kouisine" : 
          this.state.socket.emit("kouisine",() => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;

          case "jotaro" : 
          this.state.socket.emit("jotaro",() => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;

          case "gyoza" : 
          this.state.socket.emit("gyoza",() => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;

          case "ban":
            this.state.socket.emit("banned_kekw", () => {
              document.getElementById("currentMessage").value = "";
              this.setState({ currentMessage: "" });
            });
            break;

          default:
            console.log("Invalid command");
            break;
        }
      } else {
        this.state.socket.emit(
          "sendMessage",
          {
            message_data: {
              message: this.state.currentMessage,
              timestamp: Date.now(),
              user_id: this.props.userId,
              username: this.props.username,
            },
            channel_id: this.state.channelID,
          },
          () => {
            document.getElementById("currentMessage").value = "";
            this.setState({ currentMessage: "" });
          }
        );
      }
    }
  };
  async addRemoveFavorites() {
    var bodyData = {
      id: this.props.userId,
      saved_channels: this.state.channelID,
      saved_channels_name: this.state.data.chat_name,
    };

    if (this.state.alreadyFaved) {
      await axios
        .post(API_ADRESS + "/api/user/removeFavorites", bodyData)
        .then((res) => this.setState({ favorites: res.data.favorites }))
        .then(() => this.setState({ alreadyFaved: false }));
    } else {
      await axios
        .post(API_ADRESS + "/api/user/addFavorites", bodyData)
        .then((res) => this.setState({ favorites: res.data.favorites }))
        .then(() => this.setState({ alreadyFaved: true }));
    }
  }

  timeConverter(timestamp) {
    var a = new Date(timestamp);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }
  createPreviousMessages() {
    return this.state.messages.map((message) => {
      return (
        <div className="message">
          {message.type === "banned_kekw" ? (
            <div>
              <img
                src="https://pbs.twimg.com/media/EE0evPfXoAEIhlB?format=jpg&name=small"
                height="250"
                alt=""
              />
              <p>Cringe + ratio, {message.username} got banned lmao !!</p>
            </div>
          ) :
          message.type === "joined" ? (
            <div>            
              <img
                src="https://c.tenor.com/x5jwK4cZEnsAAAAC/pepe-hype-hands-up.gif"
                height="250"
                alt=""/>
              <p>{message.username} has joined the chat guys !!</p>
            </div>
            ) :

          message.type === "jotaro" ? (
            <div>            
              <img
                src="https://c.tenor.com/wcjNQLrrWmAAAAAC/jojo-jotaro.gif"
                height="250"
                alt=""/>
              <p>Yare yare daze....</p>
            </div>
            ) :
          

          message.type === "kouisine" ? (
            <div>            
              <img
                src="https://c.tenor.com/MJN7q_vv9scAAAAM/kouizine-couizine.gif"
                height="250"
                alt=""/>
              <p>Careful about Twitter boys</p>
            </div>
            ) :

          message.type === "gyoza" ? (
            <div>            
              <img
                src="https://thumbs.gfycat.com/ThunderousOrderlyBronco-size_restricted.gif"
                height="250"
                alt=""/>
              <p>{message.username} is a delicious gyoza!</p>
            </div>
            ) :

          message.type === "gigachad" ? (
            <div>            
              <img
                src="https://c.tenor.com/QhAjQ51RQlEAAAAM/decay.gif"
                height="250"
                alt=""/>
              <p>{message.username} is a giga chad !!</p>
            </div>
            ) :
          message.type === "No_channel" ? (
            <div>            
              <img
                src="https://pics.me.me/thumb_confused-black-guy-meme-ecosia-49040433.png"
                height="250"
                alt=""/>
              <p>There is no channels like that bro.</p>
            </div>
            ) :
          message.type === "No_right" ? (
            <div>            
              <img
                src="https://img-9gag-fun.9cache.com/photo/a1rL3vY_460s.jpg"
                height="250"
                alt=""/>
              <p>You don't have admin rights on this channel my dude.</p>
            </div>
            ) :

          message.type === "Removed" ? (
            <div>            
              <img
                src="https://c.tenor.com/HnQP9blJkbYAAAAM/disappearing-rr11.gif"
                height="250"
                alt=""/>
              <p>The channel has been removed, RIP !</p>
            </div>
            ) :
            message.type === "disconnected" ? (
            <div>            
              <img
                src="https://www.kindpng.com/picc/m/104-1046489_sadcat-meme-memes-sad-cat-crying-cat-meme.png"
                height="250"
                alt=""/>
              <p>{message.username} left us alone...</p>
            </div>
            ) :
            message.type === "octogone" ? (
            <div>            
              <img
                src="https://media3.giphy.com/media/l0HlLtQ0qOpz6Ueyc/giphy.gif?cid=790b761181d1245ca6abdc58e0f6e8bfce7df0a99a368e10&rid=giphy.gif&ct=g"
                height="250"
                alt=""/>
              <p>CHECK THIS OUT GUYS! CRIPPLE FIGHT BETWEEN {message.username_1.toUpperCase()} AND {message.username_2.toUpperCase()} !!</p>
            </div>
            ) :

            message.type === "face_swap" ? (
            <div>            
              <img
                src="https://media4.giphy.com/media/11UoE5sGTJo83AP1Ly/giphy.gif?cid=790b7611dd6bb32b9d41304e73ec22562882ca8cdac93060&rid=giphy.gif&ct=g"
                height="250"
                alt=""/>
              <p>{message.username_1} has assumed a new identity : {message.username_2} !</p>
            </div>
            ) :

            message.type === "coming" ? (
            <div>            
              <img
                src="https://c.tenor.com/nXCgMzIyV3IAAAAM/full-metal-alchemist-anime.gif"
                height="250"
                alt=""/>
              <p>{message.username_1} is coming for you {message.username_2}, just wait for him !</p>
            </div>
            ) :

            message.type === "help" ? (
              <div>            
                  • /nick nickname: define the nickname of the user on the server.<br/>
                  • /list : list the available channels from the server.<br/>
                  • /create channel: create a channel with the specified name.<br/>
                  • /delete channel: delete the channel with the specified name.<br/>
                  • /quit channel: quit the specified channel.<br/>
                  • /users: list the users currently in the channel<br/>
                  • message: send message the all the users on the channel<br/>
              </div>
            ) :
            message.type === "getChannels" ? 
              (
                <div>
                <img
                  src="https://memegenerator.net/img/instances/51366025/where-am-i.jpg"
                  height="250"
                  alt=""/>
                <div>
                  {message.channels.map((channel) => {return (<div> • {channel.chat_name}<br/></div>)})}
                </div>
              </div>
            ) :

            message.type === "Created_Channel" ? 
              (
                <div>
                <img
                  src="https://c.tenor.com/1VAMPydBIokAAAAC/obi-wan-kenobi-star-wars.gif"
                  height="250"
                  alt=""/>
                <p>Your channel has been created.</p>
              </div>
            ) :

            message.type === "getUsers" ? 
            (
              <div>
                <img
                  src="https://i.imgflip.com/636u5a.jpg"
                  height="250"
                  alt=""/>
                <div>
                  {(message.users.map((user) => {return (<div> • {user.username}<br/></div>)}))}
                </div>
              </div>
            ) :
            (
            <div className="input2">
              <div>
                <span className="messageUsername">{message.username} :</span>{" "}
                <span className="messageTime">
                  {this.timeConverter(message.timestamp)}
                </span>
              </div>
              <p className="messageContent">{message.message}</p>
            </div>
          )}
        </div>
      );
    });
  }
  async changeNickname(nickname) {
    this.state.socket.emit("changeNickname",nickname);
  }
  async getUsers() {
    await axios
      .get(API_ADRESS + "/api/chat/get_users?id=" + this.state.channelID)
      .then((res)=> this.setState({messages: [...this.state.messages,{"type":"getUsers", "users" : res.data }]}))
  }
  async getChannels() {
    await fetch(API_ADRESS + "/api/chat/get_all_chats")
      .then((res)=>res.json())
      .then((res)=> this.setState({messages: [...this.state.messages,{"type":"getChannels", "channels" : res }]}))
  }

  async createNewChannel(chat_name){
    await axios
        .post(API_ADRESS + "/api/chat/create_chat", {
          creator_id: this.props.userId,
          chat_name: chat_name,
          public: true,
          password: {
            enabled: false,
            password: "",
          },
        })
    this.setState({messages: [...this.state.messages,{"type":"Created_Channel"}]})
  }

  async deleteChannel(chat_name){
    await axios
        .post(API_ADRESS + "/api/chat/delete_chat", {
          user_id: this.props.userId,
          chat_name: chat_name,
        })
        .then((res)=>{
          if(res.data === "Not found"){
            this.setState({messages: [...this.state.messages,{"type":"No_channel"}]})
          }
          if(res.data === "Pas les droits"){
            this.setState({messages: [...this.state.messages,{"type":"No_right"}]})
          }
          if(res.data === "Removed"){
            this.setState({messages: [...this.state.messages,{"type":"Removed"}]})
          }
        })
  }

  render() {
    return (
      <div className="chat">
        {this.props.isLog() ? (
          this.state.alreadyFaved ? (
            <button onClick={() => this.addRemoveFavorites()}>
              Remove to favorites
            </button>
          ) : (
            <button onClick={() => this.addRemoveFavorites()}>
              Add to favorites
            </button>
          )
        ) : null}
        <div>
          <h1>Nom du channel : {this.state.data.chat_name}</h1>
          {this.state.messages ? this.createPreviousMessages() : null}
          <input
            type="text"
            id="currentMessage"
            name="currentMessage"
            placeholder="message"
            className="input"
            onChange={this.handleChange}
          />
          <button id="buttonRegister" onClick={this.handleSubmit}>
            Send message
          </button>
        </div>
      </div>
    );
  }
}
