import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface UIState {
  chatSider: {
    open: boolean;
    type: 'contact' | 'starred' | 'shared';
  };
  snackbar: {
    open: boolean;
    type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    message: string;
  };
}

const initialState: UIState = {
  chatSider: {
    open: false,
    type: 'contact',
  },
  snackbar: {
    open: false,
    type: 'success',
    message: '',
  },
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setChatSider(state, action: PayloadAction<typeof initialState.chatSider>) {
      state.chatSider = action.payload;
    },
    setSnackbar(state, action: PayloadAction<typeof initialState.snackbar>) {
      state.snackbar = action.payload;
    },
  },
});

export const selectUI = (state: RootState) => state.ui;
export const { setSnackbar, setChatSider } = slice.actions;
export default slice.reducer;
