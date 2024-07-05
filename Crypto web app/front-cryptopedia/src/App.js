import logo from "./logo.svg";
import "./App.css";
import { Feed } from "./component/rss/Feed";
import Source from "./component/admin/Source";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ListReferential from "./referential/ListReferential";
import SourceUser from "./component/user/SourceUser";

function App() {
  return (
    <div className="App h-screen w-screen ">
      <Provider store={store}>
        <SourceUser />
        <ListReferential/>
      </Provider>
    </div>
  );
}

export default App;
