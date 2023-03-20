import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ToastOptions, ToastPosition } from 'react-hot-toast';
import { RootState } from '..';

export interface SettingsState {
  theme: {
    mode: 'light' | 'dark';
    colorPrimary: string;
  };
  notification: {
    enabled: boolean;
    position: ToastPosition;
    duration: ToastOptions['duration'];
  };
  mutedFriends: string[];
  blockedFriends: string[];
}

const initialState: SettingsState = {
  theme: {
    mode: 'light',
    colorPrimary: '#339af0',
  },
  notification: {
    enabled: true,
    position: 'top-right',
    duration: 4000,
  },
  mutedFriends: [],
  blockedFriends: [],
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<SettingsState['theme']['mode']>) {
      state.theme.mode = action.payload;
    },
    setPrimaryColor(
      state,
      action: PayloadAction<SettingsState['theme']['colorPrimary']>
    ) {
      state.theme.colorPrimary = action.payload;
    },
    setNotification(
      state,
      action: PayloadAction<SettingsState['notification']>
    ) {
      state.notification = action.payload;
    },
    addMutedFriend(
      state,
      action: PayloadAction<SettingsState['mutedFriends'][number]>
    ) {
      state.mutedFriends.push(action.payload);
    },
    removeMutedFriend(
      state,
      action: PayloadAction<SettingsState['mutedFriends'][number]>
    ) {
      state.mutedFriends = state.mutedFriends.filter(f => f !== action.payload);
    },
  },
});

export const selectSettings = (state: RootState) => state.settings;
export const {
  setMode,
  setPrimaryColor,
  setNotification,
  addMutedFriend,
  removeMutedFriend,
} = slice.actions;
export default slice.reducer;
