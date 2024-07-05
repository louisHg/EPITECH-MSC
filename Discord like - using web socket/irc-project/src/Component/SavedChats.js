import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import "./SavedChats";

//const API_ADRESS = 'http://10.26.112.182:9000';
const API_ADRESS = "http://localhost:5000";

class SavedChatsProxy extends React.Component {
  state = {
    date: "",
  };
  componentDidMount() {
    this.callApi();
  }

  async callApi() {
    console.log(this.props)
    console.log(this.props.getUserId())
    await fetch (API_ADRESS + "/api/user/get_all_favorite_chats?id=" + this.props.getUserId())
      .then((res) => res.text())
      .then((res) => this.setState({ data: JSON.parse(res) }));
  }

  createRows() {
    if(this.state.data.length === 0){
      return <p>You have no saved channels yet.</p>
    }
    return this.state.data.map((channel) => {
      console.log(channel)
      return (
        <Link to={"/chat?id=" + channel.channel_id}>
          <div key={channel.saved_channels}>
            <p2>
              Name : {channel.channel_name}
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

export default function SavedChats(props) {
  const navigation = useNavigate();
  console.log(props.getUserId())
  return <SavedChatsProxy navigation={navigation} getUserId={props.getUserId}/>;
}
