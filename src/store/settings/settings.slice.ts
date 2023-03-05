import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<typeof initialState.theme.mode>) {
      state.theme.mode = action.payload;
    },
    setPrimaryColor(
      state,
      action: PayloadAction<typeof initialState.theme.colorPrimary>
    ) {
      state.theme.colorPrimary = action.payload;
    },
  },
});

export const selectSettings = (state: RootState) => state.settings;
export const { setMode, setPrimaryColor } = slice.actions;
export default slice.reducer;
