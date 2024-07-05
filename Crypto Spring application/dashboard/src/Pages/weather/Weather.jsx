import "./weather.css"
import Meteo from "../../Components/widgets/Meteo"

export default function Weather(props) {
    return (
        <div className='weather'>
            <Meteo name={ props.match.params.name }/>
        </div>
    )
}