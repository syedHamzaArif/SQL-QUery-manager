import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// import reducers
import databaseSlice from "./reducers/databaseSlice";
import accountSlice from "./reducers/accountSlice";
import freeCreditSlice from "./reducers/freeCreditSlice";
import darkModeSlice from "./reducers/darkModeSlice";

const reducers = combineReducers({
  userDatabases: databaseSlice,
  accounts: accountSlice,
  freeCredits: freeCreditSlice,
  darkmode: darkModeSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: {
    persistedReducer,
  },
  middleware: [thunk],
});

export default store;
export const persistor = persistStore(store)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
