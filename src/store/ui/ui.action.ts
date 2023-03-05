import { AppThunk } from '..';
import { setSnackbar } from './ui.slice';

export const SetSnackbar =
  (
    open: boolean,
    type: 'success' | 'error' | 'warning' | 'info' | 'loading' = 'info',
    message: string = ''
  ): AppThunk =>
  (dispatch, _getState) => {
    dispatch(setSnackbar({ open, type, message }));
  };
