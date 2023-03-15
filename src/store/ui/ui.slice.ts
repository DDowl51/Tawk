import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface UIState {
  chatSider: {
    open: boolean;
    type: 'contact' | 'starred' | 'shared';
  };
  friendsDialog: {
    open: boolean;
  };
  createGroupDialog: {
    open: boolean;
  };
  messageSider: {
    open: boolean;
    type: 'video' | 'audio';
    width: string;
  };
}

const initialState: UIState = {
  chatSider: {
    open: false,
    type: 'contact',
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
  setChatSider,
  setFriendsDialog,
  setCreateGroupDialog,
  setMessageSider,
} = slice.actions;
export default slice.reducer;
