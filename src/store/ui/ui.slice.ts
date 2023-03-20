import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface UIState {
  chatSider: {
    open: boolean;
    type: 'contact' | 'starred' | 'shared';
  };
  groupSider: {
    open: boolean;
    type: 'info' | 'photo' | 'file' | 'link';
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
  addAdminModal: {
    open: boolean;
  };
}

const initialState: UIState = {
  chatSider: {
    open: false,
    type: 'contact',
  },
  groupSider: {
    open: false,
    type: 'info',
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
  addAdminModal: {
    open: false,
  },
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setChatSider(state, action: PayloadAction<UIState['chatSider']>) {
      state.chatSider = action.payload;
    },
    setGroupSider(state, action: PayloadAction<UIState['groupSider']>) {
      state.groupSider = action.payload;
    },
    setFriendsDialog(state, action: PayloadAction<boolean>) {
      state.friendsDialog.open = action.payload;
    },
    setCreateGroupDialog(state, action: PayloadAction<boolean>) {
      state.createGroupDialog.open = action.payload;
    },
    setMessageSider(
      state,
      action: PayloadAction<Partial<UIState['messageSider']>>
    ) {
      state.messageSider.open = action.payload.open ?? state.messageSider.open;
      state.messageSider.type = action.payload.type ?? state.messageSider.type;
      state.messageSider.width =
        action.payload.width ?? state.messageSider.width;
    },
    setAddAdminModal(state, action: PayloadAction<boolean>) {
      state.addAdminModal.open = action.payload;
    },
  },
});

export const selectUI = (state: RootState) => state.ui;
export const {
  setChatSider,
  setGroupSider,
  setFriendsDialog,
  setCreateGroupDialog,
  setMessageSider,
  setAddAdminModal,
} = slice.actions;
export default slice.reducer;
