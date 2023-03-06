import { AppThunk } from '..';
import { setChatSider, setSnackbar } from './ui.slice';

export const SetSnackbar =
  (
    open: boolean,
    type: 'success' | 'error' | 'warning' | 'info' | 'loading' = 'info',
    message: string = ''
  ): AppThunk =>
  (dispatch, _getState) => {
    dispatch(setSnackbar({ open, type, message }));
  };

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
