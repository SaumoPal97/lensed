import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { configStore } from "./redux/configStore";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
// import { TransactionsProvider } from "./context/TransactionContext";

const store = configStore();
const persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter forceRefresh={true}>
        <PersistGate persistor={persistor}>
          {/* <TransactionsProvider> */}
          <App />
          {/* </TransactionsProvider> */}
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
