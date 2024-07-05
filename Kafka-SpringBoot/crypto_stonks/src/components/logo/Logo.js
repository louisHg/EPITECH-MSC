export default function Logo(props) {
    
    if(props.TROLL_MODE) return <img src='/logo/Woah des cryptos.jpg' alt='' 
        style={{
            margin: 15,
            position: "absolute", 
            width: "130px", 
            height: "fit-content", 
            top: 0, 
            left: 0
        }}/>
    return <img src='CryptoLogo.png' alt='' 
        style={{
            margin: 15,
            position: "absolute", 
            width: "130px", 
            height: "fit-content", 
            top: 0, 
            left: 0
        }}/>
}