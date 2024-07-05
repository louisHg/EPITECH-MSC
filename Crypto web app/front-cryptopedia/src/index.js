import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Register from "./view/Register";
import reportWebVitals from "./reportWebVitals";
import SideBarLink from "./view/sideBar";
import Log from "./view/Log";
import { AuthProvider } from "./view/auth";
import { RequireAuth } from "./view/RequireAuth";
import SideUser from "./view/Sideuser";
import CryptoChart from "./chart/CryptoChart";
import { Feed } from "./component/rss/Feed";
import Source from "./component/admin/Source";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { RequireRole } from "./view/RequireRole";
import { Article } from "./component/rss/Article";
import Profile from "./view/profile";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <div className="flexModeWrap">
      <SideBarLink />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <App />
              </>
            }
          />
          <Route
            path="Home"
            element={
              <>
                <App />
              </>
            }
          />
          <Route
            path="Crypto"
            element={
              <>
                <CryptoChart />
              </>
            }
          />
          <Route
            path="Chat"
            element={
              <>
                <App />
              </>
            }
          />
          <Route path="Register" element={<Register />} />
          <Route
            path="Article"
            element={
              <>
                <Feed />
              </>
            }
          />
          <Route path="Log" element={<Log />} />
          <Route
            path="profile"
            element={
              <Provider store={store}>
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              </Provider>
            }
          />
          <Route
            path="Admin/rss"
            element={
              <RequireRole>
                {" "}
                <Provider store={store}>
                  <Source />
                </Provider>
              </RequireRole>
            }
          />
          <Route path="Chart" element={<CryptoChart />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
      <SideUser />
    </div>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
