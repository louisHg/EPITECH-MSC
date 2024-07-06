import { useState } from 'react'
import './App.css';
import Logo from './components/logo/Logo';
import MainPage from './components/main_page/MainPage';


function App() {
  const [troll_mode, setTrollMode] = useState(false)

  return (
    <div className="App" style={{width: "100%", height: "100%"}}>
      {/* <img src='/5557528.jpg' style={{position: "absolute", top:0, left: 0, width: "100%", height: "100%"}}/> */}
      <Logo TROLL_MODE={troll_mode}/>
      <MainPage troll_mode = {troll_mode}/>
{/*       <a className='btn red' 
        onClick={()=> setTrollMode(!troll_mode)} 
        style={{ 
            margin: 10, 
            position: 'absolute', 
            left: 0
          }}>
          {troll_mode ? "WORK MODE" :"TROLL MODE"}4  
        </a> */}
    </div>
  );
}

export default App;
