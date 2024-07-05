import "./villes.css"
import { Link } from "react-router-dom"

export default function Weather() {
    return (
        <div className='weather'>
            <Link to="/weathers/Paris" className="link">
                <li>
                    Paris
                </li>
            </Link>
            <Link to="/weathers/Lille" className="link">
                <li>
                    Lille
                </li>
            </Link>
            <Link to="/weathers/Thionville" className="link">
                <li>
                    Thionville
                </li>
            </Link>
        </div>
    )
}
