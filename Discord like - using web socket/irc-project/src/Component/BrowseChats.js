import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import "./BrowseChat.css";

//const API_ADRESS = 'http://10.26.112.182:9000';
const API_ADRESS = "http://localhost:5000";

class BrowseChats extends React.Component {
  state = {
    date: "",
  };
  componentDidMount() {
    this.callApi();
  }

  async callApi() {
    await fetch(API_ADRESS + "/api/chat/get_all_chats")
      .then((res) => res.text())
      .then((res) => this.setState({ data: JSON.parse(res) }));
  }

  createRows() {
    return this.state.data.map((channel) => {
      return (
        <Link to={"/chat?id=" + channel._id}>
          <div key={channel._id}>
            <p2>
              Name : {channel.chat_name}
            </p2>
          </div>
        </Link>
      );
    });
  }

  render() {
    return (
      <div className="BrowseChats">
        <Link to="/" className="link">
          <p1>JAVAX</p1>
        </Link>
        <div>{this.state.data ? this.createRows() : null}</div>
      </div>
    );
  }
}

export default function BrowseChatsFunc() {
  const navigation = useNavigate();
  return <BrowseChats navigation={navigation} />;
}
