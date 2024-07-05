import "./topbar.css";
import { NotificationsNone, Settings } from "@material-ui/icons";
import React from 'react';
import {NavLink, withRouter} from 'react-router-dom'
import Logo from "../../assets/logo.png"

function Topbar({history,isLogged}) {

  const handleClick=() =>{
    history.push('/')
    isLogged(false)
  }
  return (
    <nav>
      <div className="topbar">
        <div className="topbarWrapper">
          <div className="topLeft">
            <span className="logo" onClick={() => history.push('/')}>
              JAVAX
            </span>
          </div>
          <div className="topRight">

            <div className="topbarIconContainer">
              <NotificationsNone />
              <span className="topIconBadge">0</span>
            </div>

            <div className="topbarIconContainer">
              <Settings />
              <span className="topIconBadge">2</span>
            </div>

            <div className="topbarIconContainer" onClick={handleClick}>
              Logout
            </div>
              
            <NavLink exact to='/' activeClassName='active'>
              <img src={Logo} alt="" className="topAvatar"/>
            </NavLink>  

          </div>
        </div>
      </div>
    </nav>
  );
}
export default withRouter(Topbar);
