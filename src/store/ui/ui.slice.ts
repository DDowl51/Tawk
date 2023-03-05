import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface UIState {
  snackbar: {
    open: boolean;
    type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    message: string;
  };
}

const initialState: UIState = {
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
    setSnackbar(state, action: PayloadAction<typeof initialState.snackbar>) {
      state.snackbar = action.payload;
    },
  },
});

export const selectUI = (state: RootState) => state.ui;
export const { setSnackbar } = slice.actions;
export default slice.reducer;
