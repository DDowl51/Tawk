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
  friendsDialog: {
    open: boolean;
  };
  createGroupDialog: {
    open: boolean;
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
  friendsDialog: {
    open: false,
  },
  createGroupDialog: {
    open: false,
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
    setFriendsDialog(state, action: PayloadAction<boolean>) {
      state.friendsDialog.open = action.payload;
    },
    setCreateGroupDialog(state, action: PayloadAction<boolean>) {
      state.createGroupDialog.open = action.payload;
    },
  },
});

export const selectUI = (state: RootState) => state.ui;
export const {
  setSnackbar,
  setChatSider,
  setFriendsDialog,
  setCreateGroupDialog,
} = slice.actions;
export default slice.reducer;
