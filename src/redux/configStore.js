import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { fork } from "redux-saga/effects";

import rootReducer from "./rootReducer";

function* rootSaga() {}

const sagaMiddleware = createSagaMiddleware();

export const configStore = () => {
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  return store;
};
