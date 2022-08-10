import { Switch, Route } from "react-router-dom";
// import NotFoundPage from "./components/NotFoundPage";
// import Products from "./containers/Products";
// import Profile from "./containers/Profile";
// import Purchases from "./containers/Purchases";
// import Link from "./containers/Link";

function App() {
  return (
    <div>
      <Switch>
        {/* <Route path="/" exact component={Products} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/purchases" exact component={Purchases} />
        <Route path="/link/:id" exact component={Link} />
        <Route path="*" component={NotFoundPage} /> */}
      </Switch>
    </div>
  );
}

export default App;
