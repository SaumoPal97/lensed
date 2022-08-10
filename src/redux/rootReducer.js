import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: [],
};

const rootReducer = combineReducers({});

export default persistReducer(persistConfig, rootReducer);
