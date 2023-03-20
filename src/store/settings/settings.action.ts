import { AppThunk } from '..';
import {
  addMutedFriend,
  removeMutedFriend,
  setMode,
  setNotification,
  setPrimaryColor,
  SettingsState,
} from './settings.slice';

export const SwitchMode = (): AppThunk => (dispatch, getState) => {
  const currentMode = getState().settings.theme.mode;
  dispatch(setMode(currentMode === 'dark' ? 'light' : 'dark'));
};

export const SetPrimaryColor =
  (primaryColor: string): AppThunk =>
  dispatch => {
    dispatch(setPrimaryColor(primaryColor));
  };

export const SetNotification =
  (formValues: SettingsState['notification']): AppThunk =>
  dispatch => {
    dispatch(setNotification(formValues));
  };

export const MuteFriend =
  (userId: string): AppThunk =>
  (dispatch, getState) => {
    const { mutedFriends } = getState().settings;
    if (mutedFriends.includes(userId)) return;

    dispatch(addMutedFriend(userId));
  };

export const UnmuteFriend =
  (userId: string): AppThunk =>
  (dispatch, getState) => {
    const { mutedFriends } = getState().settings;
    if (!mutedFriends.includes(userId)) return;

    dispatch(removeMutedFriend(userId));
  };
