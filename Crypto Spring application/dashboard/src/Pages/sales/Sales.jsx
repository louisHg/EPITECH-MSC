import "./sales.css"

import {Link} from 'react-router-dom'

export default function Home() {
    return (
        <div className="sales">
            <Link to="/BTC1" className="link">
                <li>
                    BTC1
                </li>
            </Link>
            <Link to="/BTC2" className="link">
                <li>
                    BTC2
                </li>
            </Link>
        </div>
    )
}