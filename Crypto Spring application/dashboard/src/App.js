import React from 'react';
import {Switch,Route} from 'react-router-dom'
import Login from './Pages/Login/Login';
import Acces from './Pages/routes/Acces';
import Register from './Pages/register/Register';
import AboutJson from './Pages/aboutjson'
import { useState } from 'react';

var data  = require("./Pages/data.json");

function App(){

  const [isLog,setLog] = useState(false);
  const [username,setUsername] = useState(false);

  return(
      <div>
        <Switch>
          {
            !isLog ?
            <Route exact path='/' render={() => <Login isLogin={setLog} username={setUsername}/>}/>
              :
            <Route path='/' render={() =><Acces username = {username} handleLogged={isLog}/> }/>
          }
        <Route path='/about.json' > <AboutJson props={data}/> </Route>  
        <Route path='*' component={Register}/>
        </Switch>
      </div>
  )
}

export default App;