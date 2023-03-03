import { AppThunk } from '..';
import { setMode } from './settings.slice';

export const SwitchMode = (): AppThunk => (dispatch, getState) => {
  const currentMode = getState().settings.theme.mode;
  dispatch(setMode(currentMode === 'dark' ? 'light' : 'dark'));
};
