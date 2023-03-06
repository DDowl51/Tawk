import { AppThunk } from '..';
import { SetSnackbar } from '../ui/ui.action';
import {
  login,
  setLoginLoading,
  setRegisterEmail,
  setRegisterLoading,
} from './auth.slice';
import { PATH_AUTH } from 'routes/path';
import * as Requests from 'requests';

export const Login =
  (formValues: { email: string; password: string }): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(setLoginLoading(true));
    try {
      const { userId, token } = await Requests.Login(
        formValues.email,
        formValues.password
      );
      dispatch(login({ userId, token }));
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
      const { userId, token, message } = await Requests.VerifyOTP(
        getState().auth.register.verifyingEmail,
        formValues.otp
      );

      dispatch(login({ userId, token }));
      dispatch(SetSnackbar(true, 'success', message));
      dispatch(setRegisterEmail(''));
    } catch (error) {
      dispatch(SetSnackbar(true, 'error', (error as Error).message));
    } finally {
      dispatch(setRegisterLoading(false));
    }
  };
