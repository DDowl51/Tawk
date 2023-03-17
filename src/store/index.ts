import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import settingsReducer from './settings/settings.slice';
import authReducer from './auth/auth.slice';
import uiReducer from './ui/ui.slice';
import dataReducer from './data/data.slice';
import mediaReducer from './media/media.slice';
import { useDispatch } from 'react-redux';
import { chatApi } from './services';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['media', chatApi.reducerPath],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  auth: authReducer,
  ui: uiReducer,
  data: dataReducer,
  media: mediaReducer,
  // Add the generated reducer as a specific top-level slice
  [chatApi.reducerPath]: chatApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(chatApi.middleware),
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch = useDispatch<AppDispatch>;

export default store;
