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

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['media'],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  auth: authReducer,
  ui: uiReducer,
  data: dataReducer,
  media: mediaReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

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
