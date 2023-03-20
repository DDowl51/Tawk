import toast from 'react-hot-toast';
import { AppThunk } from '..';
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
  setCurrentSingleChatroomId,
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
      const { chatrooms } = await Requests.GetUserChatrooms(token);
      dispatch(login({ userId: user._id, token }));
      dispatch(setUser(user));
      dispatch(setChatrooms(chatrooms));

      // Get GroupChatrooms Info
    } catch (error) {
      toast.error((error as Error).message);
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
      toast.error((error as Error).message);
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
      toast.success(message || 'success');
      dispatch(setRegisterEmail(''));
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      dispatch(setRegisterLoading(false));
    }
  };

export const Logout = (): AppThunk => dispatch => {
  dispatch(logout());
  dispatch(setChatrooms([]));
  dispatch(setUser(null));
  dispatch(clearFriendRequest());
  dispatch(setCurrentSingleChatroomId(''));
};
