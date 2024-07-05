import { useNavigate } from "react-router-dom";
import react from "react";
import "./MainPage.css";

//const API_ADRESS = 'http://10.26.112.182:9000';

class MainPageProxy extends react.Component {
  redirectTo(url) {
    this.props.navigate(url);
  }

  disconnect() {
    this.props.setUsername("");
    this.props.setUserId("");
    this.props.setLog(false);
  }

  render() {
    return (
      <div className="centered">
        <div>
          <p1>JAVAX</p1>
          {this.props.isLog() ? (
            <p>
              Welcome {this.props.username()}
            </p>
          ) : null}
          <button onClick={() => this.redirectTo("/browse_chats")}>
            Join chatroom
          </button>
          <br />
          <button onClick={() => this.redirectTo("/create_chat")}>
            New chatroom
          </button>
          <br />
          {this.props.isLog() ? (
            <div>
              <button onClick={() => this.redirectTo("/saved_chats")}>
                Browse saved chatroom
              </button>
              <br />
              <button onClick={() => this.disconnect()}>Disconnect</button>
            </div>
          ) : (
            <div>
              <button onClick={() => this.redirectTo("/login")}>
                Login / Register
              </button>
              <br />
            </div>
          )}
        </div>
      </div>
    );
  }
}

function MainPage(props) {
  const navigate = useNavigate();
  return (
    <MainPageProxy
      setLog={props.setLog}
      setUsername={props.setUsername}
      setUserId={props.setUserId}
      isLog={props.isLog}
      userId={props.userId}
      username={props.username}
      navigate={navigate}
    />
  );
}

export default MainPage;
