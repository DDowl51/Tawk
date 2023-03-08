import { AppThunk } from '..';
import { SetSnackbar } from '../ui/ui.action';
import {
  login,
  logout,
  setLoginLoading,
  setRegisterEmail,
  setRegisterLoading,
} from './auth.slice';
import { PATH_AUTH } from 'routes/path';
import * as Requests from 'requests';
import {
  clearFriendRequest,
  setChatrooms,
  setCurrentChatroomId,
  setUser,
} from 'store/data/data.slice';

export const Login =
  (formValues: { email: string; password: string }): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(setLoginLoading(true));
    try {
      const { user, token } = await Requests.Login(
        formValues.email,
        formValues.password
      );
      dispatch(login({ userId: user._id, token }));
      dispatch(setUser(user));
    } catch (error) {
      dispatch(SetSnackbar(true, 'error', (error as Error).message));
    } finally {
      dispatch(setLoginLoading(false));
    }
  };

export const Register =
  (formValues: { name: string; email: string; password: string }): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(setRegisterLoading(true));
    try {
      dispatch(setRegisterEmail(formValues.email));
      await Requests.Register(
        formValues.email,
        formValues.name,
        formValues.password
      );
      window.location.href = PATH_AUTH.auth.verify;
    } catch (error) {
      dispatch(SetSnackbar(true, 'error', (error as Error).message));
    } finally {
      dispatch(setRegisterLoading(false));
    }
  };

export const VerifyOTP =
  (formValues: { otp: string }): AppThunk =>
  async (dispatch, getState) => {
    dispatch(setRegisterLoading(true));

    try {
      const { user, token, message } = await Requests.VerifyOTP(
        getState().auth.register.verifyingEmail,
        formValues.otp
      );

      dispatch(login({ userId: user._id, token }));
      dispatch(setUser(user));
      dispatch(SetSnackbar(true, 'success', message));
      dispatch(setRegisterEmail(''));
    } catch (error) {
      dispatch(SetSnackbar(true, 'error', (error as Error).message));
    } finally {
      dispatch(setRegisterLoading(false));
    }
  };

export const Logout = (): AppThunk => dispatch => {
  dispatch(logout());
  dispatch(setChatrooms([]));
  dispatch(setUser(null));
  dispatch(clearFriendRequest());
  dispatch(setCurrentChatroomId(''));
};
