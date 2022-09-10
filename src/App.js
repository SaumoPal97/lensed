import { Switch, Route } from "react-router-dom";
import NotFoundPage from "./components/NotFoundPage";
import Home from "./containers/Home";
// import Products from "./containers/Products";
// import Profile from "./containers/Profile";
// import Purchases from "./containers/Purchases";
import Post from "./containers/Post";
import AskAQuestion from "./containers/AskAQuestion";
import { WagmiConfig, createClient } from "wagmi";
import { configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

function App() {
  const { provider, webSocketProvider } = configureChains(
    [chain.polygon],
    [publicProvider()]
  );

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });

  return (
    <WagmiConfig client={client}>
      <div className="flex flex-row justify-center items-center">
        <div className="w-9/12">
          <Switch>
            <Route path="/" exact component={Home} />
            {/* <Route path="/profile" exact component={Profile} />
        <Route path="/purchases" exact component={Purchases} /> */}
            <Route path="/posts/:id" exact component={Post} />
            <Route path="/ask" exact component={AskAQuestion} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    </WagmiConfig>
  );
}

export default App;
