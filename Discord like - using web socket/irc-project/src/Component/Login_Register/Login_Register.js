import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./log.css";

//const API_ADRESS = 'http://10.26.112.182:9000';

function Login_Register(props) {
  const navigation = useNavigate();
  const [login, setLogin] = useState(true);

  function backToMenu() {
    navigation("/");
  }

  return (
    <div className="log">
      <Link to="/" className="link">
        <p1>JAVAX</p1>
      </Link>
      {login ? (
        <div>
          <Login
            setLog={props.setLog}
            setUsername={props.setUsername}
            setUserId={props.setUserId}
            setFavorites={props.setFavorites}
          />
          <button onClick={() => setLogin(false)}>Register</button>
        </div>
      ) : (
        <div>
          <Register
            setLog={props.setLog}
            setUsername={props.setUsername}
            setUserId={props.setUserId}
            setFavorites={props.setFavorites}
          />
          <button onClick={() => setLogin(true)}>Login</button>
        </div>
      )}
    </div>
  );
}
export default Login_Register;
