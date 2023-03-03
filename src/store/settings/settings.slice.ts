import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface SettingsState {
  theme: {
    mode: 'light' | 'dark';
    colorPrimary: string;
  };
}

const initialState: SettingsState = {
  theme: {
    mode: 'light',
    colorPrimary: '#339af0',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<typeof initialState.theme.mode>) {
      state.theme.mode = action.payload;
    },
  },
});

export const selectSettings = (state: RootState) => state.settings;
export const { setMode } = settingsSlice.actions;
export default settingsSlice.reducer;
