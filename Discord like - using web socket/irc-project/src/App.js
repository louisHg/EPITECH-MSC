import { Route, Routes, BrowserRouter } from "react-router-dom";
import React from "react";
import { useState } from "react";

import MainPage from "./Component/MainPage";
import LoginToChat from "./Component/LoginToChat";
import CreateChat from "./Component/CreateChat";
import SavedChats from "./Component/SavedChats";
import BrowseChats from "./Component/BrowseChats";
import LoginRegister from "./Component/Login_Register/Login_Register";

//const API_ADRESS = 'http://10.26.112.182:9000';

function App() {
  const [isLog, setLog] = useState(false);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [favorites, setFavorites] = useState("");

  function getLog() {
    return isLog;
  }
  function getUsername() {
    return username;
  }
  function getUserId() {
    return userId;
  }
  function getFavorites() {
    return favorites;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path={"/"}
            element={
              <MainPage
                setLog={setLog}
                setUsername={setUsername}
                setUserId={setUserId}
                isLog={getLog}
                userId={getUserId}
                username={getUsername}
              />
            }
          />
          <Route
            path={"/chat"}
            element={
              <LoginToChat
                isLog={getLog}
                getUserId={getUserId}
                getUsername={getUsername}
                getFavorites={getFavorites}
                setUsername={setUsername}
                setUserId={setUserId}
              />
            }
          />

          <Route
            path={"/create_chat"}
            element={
              <CreateChat
                isLog={getLog}
                userId={getUserId}
                username={getUsername}
                setUsername={setUsername}
                setUserId={setUserId}
              />
            }
          />
          <Route path={"/browse_chats"} element={<BrowseChats />} />

          <Route path={"/saved_chats"} element={<SavedChats getUserId={getUserId}/>} />

          <Route
            path={"/login"}
            element={
              <LoginRegister
                setLog={setLog}
                setUsername={setUsername}
                setUserId={setUserId}
                setFavorites={setFavorites}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
