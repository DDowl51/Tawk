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
  messageSider: {
    open: boolean;
    type: 'video';
    width: string;
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
  messageSider: {
    // MessageList中的sider, 视频通话用
    open: false,
    type: 'video',
    width: '50%',
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
    setMessageSider(
      state,
      action: PayloadAction<Partial<typeof initialState.messageSider>>
    ) {
      state.messageSider.open = action.payload.open ?? state.messageSider.open;
      state.messageSider.type = action.payload.type ?? state.messageSider.type;
      state.messageSider.width =
        action.payload.width ?? state.messageSider.width;
    },
  },
});

export const selectUI = (state: RootState) => state.ui;
export const {
  setSnackbar,
  setChatSider,
  setFriendsDialog,
  setCreateGroupDialog,
  setMessageSider,
} = slice.actions;
export default slice.reducer;
