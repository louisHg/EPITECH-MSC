import "./sidebar.css"
import{
    LineStyle,
    CloudDone,
    TrendingUp,
} from "@material-ui/icons";
import {Link, withRouter} from 'react-router-dom'

function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>
                    <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarListItem">
                            <LineStyle className="sidebarIcon" />
                            Home
                            </li>
                        </Link>
                        <Link to="/villes" className="link">
                            <li className="sidebarListItem">
                                <CloudDone className="sidebarIcon"/>
                                <p>Weather</p>
                            </li>
                        </Link>
                        
                        <Link to="/sales" className="link">
                            <li className="sidebarListItem">
                                <TrendingUp className="sidebarIcon"/>
                                Sales
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Sidebar);