import { AppThunk } from '..';
import { setMode, setPrimaryColor } from './settings.slice';

export const SwitchMode = (): AppThunk => (dispatch, getState) => {
  const currentMode = getState().settings.theme.mode;
  dispatch(setMode(currentMode === 'dark' ? 'light' : 'dark'));
};

export const SetPrimaryColor =
  (primaryColor: string): AppThunk =>
  dispatch => {
    dispatch(setPrimaryColor(primaryColor));
  };
