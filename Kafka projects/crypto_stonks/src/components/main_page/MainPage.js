import { REQUEST_STATE } from "../../helpers/requestState"
import SearchBar from "../search_bar/SearchBar"
import { ColorRing } from 'react-loader-spinner'
import axios from 'axios'
import { useState, useEffect } from "react"
import Error from "../error/Error"
import CryptoTable from "../crypto_table/CryptoTable"
import CryptoCard from "../crypto_infos/CryptoCard"


export default function MainPage({ troll_mode }) {


    const [request_state, setRequestState] = useState(REQUEST_STATE.LOADING)
    const [crypto_data, setCryptoData] = useState([])
    const [search_term, setSearchTerm] = useState("")
    const [current_page, setCurrentPage] = useState(1)
    const [max_page, setMaxPage] = useState(0)
    const [active_crypto, setActiveCrypto] = useState("BTC")


    useEffect(() => {
        getCryptoData()
        setInterval(getCryptoData, 10000)
    }, []);

    function getCryptoData() {
        axios.get("http://localhost:1180/crypto/lastCrypto")
            .then((resp) => {
                if(request_state !== REQUEST_STATE.SUCCESS) setRequestState(REQUEST_STATE.SUCCESS)
                if(!max_page) setMaxPage(Math.round((resp.data.length / 12) + 2))
                setCryptoData(resp.data)
            })
            .catch((_) => {
                setRequestState(REQUEST_STATE.ERROR)
                //toastr.error("Erreur lors de la récupération des données.", "", { positionClass: 'toast-bottom-left' })
            })
    }

    function getItemsForPage() {
        const startIndex = (current_page - 1) * 12;
        const endIndex = startIndex + 12;
        return crypto_data.slice(startIndex, endIndex);
    }

    function filter_crypto() {
        if (search_term.length === 0) return getItemsForPage(crypto_data)
        return crypto_data.filter((crypto) => {
            let new_search_term = search_term.toLowerCase().trim()
            let full_crypto_name = crypto.cryptoName.toLowerCase()
            let abriviation = crypto.cryptoAssetShortName.toLowerCase()

            return full_crypto_name.includes(new_search_term) || abriviation.includes(new_search_term)
        })
    }

    function allowPageClick(future_page) {
        if (future_page === 0) return false
        if (future_page >= max_page) return false
        return true
    }

    if (request_state === REQUEST_STATE.LOADING) return <ColorRing visible height={80} width={80} colors={["#e15b64", "#e15b64", "#e15b64", "#e15b64", "#e15b64"]} />
    if (request_state === REQUEST_STATE.ERROR) return <Error TROLL_MODE={troll_mode} />
    if (request_state === REQUEST_STATE.SUCCESS) return <div>
        <h2 className='center'>Cryptostonks 5ème du nom</h2>
        <SearchBar onChange={setSearchTerm} />
         <CryptoCard
            symbol={active_crypto}
            troll_mode={troll_mode}
        /> 
         <CryptoTable 
            troll_mode={troll_mode} 
            crypto_data={filter_crypto()} 
            current_page={current_page} 
            setActiveCrypto={setActiveCrypto}
            active_crypto_symbol={active_crypto}
        /> 
        {search_term.length === 0 ?
            <ul className="pagination">
                <li className={allowPageClick(current_page - 1) ? "" : "disabled"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        if (!allowPageClick(current_page - 1)) return
                        else setCurrentPage(current_page - 1)
                    }}>
                    <a><i className="material-icons">chevron_left</i></a>
                </li>

                {Array(max_page).fill(null).map((_, index) => {
                    if (index === 0) return null
                    else return <li
                        key={index}
                        className={`${allowPageClick(index) ? "" : "disabled"} ${current_page === index ? "active" : null}`}
                        style={{ cursor: "pointer" }}
                    >
                        <a onClick={() => setCurrentPage(index)}>{index}</a>
                    </li>
                })}
                <li className={allowPageClick(current_page + 1) ? "" : "disabled"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        if (!allowPageClick(current_page + 1)) return
                        else setCurrentPage(current_page + 1)
                    }}>
                    <a><i className="material-icons">chevron_right</i></a>
                </li>
            </ul>
            : null}
    </div>
}