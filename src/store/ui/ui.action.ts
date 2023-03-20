import { AppThunk } from '..';
import {
  setAddAdminModal,
  setChatSider,
  setCreateGroupDialog,
  setFriendsDialog,
  setGroupSider,
  setMessageSider,
} from './ui.slice';

export const SwitchChatSider =
  (open?: boolean): AppThunk =>
  (dispatch, getState) => {
    const chatSider = getState().ui.chatSider;
    dispatch(
      setChatSider({
        open: open ? open : !chatSider.open,
        type: chatSider.type,
      })
    );
  };

export const SetChatSider =
  (
    open: boolean,
    type: 'contact' | 'starred' | 'shared' = 'contact'
  ): AppThunk =>
  (dispatch, _getState) => {
    dispatch(setChatSider({ open, type }));
  };

export const SwitchGroupSider =
  (open?: boolean): AppThunk =>
  (dispatch, getState) => {
    const groupSider = getState().ui.groupSider;
    dispatch(
      setGroupSider({
        open: open ? open : !groupSider.open,
        type: groupSider.type,
      })
    );
  };

export const SetGroupSider =
  (
    open: boolean,
    type: 'info' | 'photo' | 'file' | 'link' = 'info'
  ): AppThunk =>
  (dispatch, _getState) => {
    dispatch(setGroupSider({ open, type }));
  };

export const CloseFriendsDialog = (): AppThunk => (dispatch, _getState) => {
  dispatch(setFriendsDialog(false));
};

export const OpenFriendsDialog = (): AppThunk => (dispatch, _getState) => {
  dispatch(setFriendsDialog(true));
};

export const OpenCreateGroupDialog = (): AppThunk => (dispatch, _getState) => {
  dispatch(setCreateGroupDialog(true));
};

export const CloseCreateGroupDialog = (): AppThunk => (dispatch, _getState) => {
  dispatch(setCreateGroupDialog(false));
};

export const OpenVideoSider = (): AppThunk => (dispatch, _getState) => {
  dispatch(setMessageSider({ open: true, type: 'video', width: '50%' }));
};

export const OpenAudioSider = (): AppThunk => (dispatch, _getState) => {
  dispatch(setMessageSider({ open: true, type: 'audio', width: '30%' }));
};

export const CloseMessageSider = (): AppThunk => (dispatch, _getState) => {
  dispatch(setMessageSider({ open: false }));
};

export const OpenAddAdminModal = (): AppThunk => (dispatch, getState) => {
  dispatch(setAddAdminModal(true));
};

export const CloseAddAdminModal = (): AppThunk => (dispatch, getState) => {
  dispatch(setAddAdminModal(false));
};
