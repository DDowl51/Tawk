import { AppThunk } from '..';
import { LoginReturnType, RegisterReturnType } from 'types';
import server from 'utils/axios';
import { SetSnackbar } from '../ui/ui.action';
import {
  login,
  setLoginLoading,
  setRegisterEmail,
  setRegisterLoading,
} from './auth.slice';
import { PATH_AUTH } from 'routes/path';

export const Login =
  (formValues: { email: string; password: string }): AppThunk =>
  async (dispatch, _getState) => {
    dispatch(setLoginLoading(true));
    try {
      const { data } = await server.post<LoginReturnType>('/auth/login', {
        email: formValues.email,
        password: formValues.password,
      });
      dispatch(login({ userId: data.userId, token: data.token }));
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
      await server.post<RegisterReturnType>('/auth/register', {
        email: formValues.email,
        password: formValues.password,
        name: formValues.name,
      });
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
      const { data } = await server.post<LoginReturnType>('/auth/verify-otp', {
        email: getState().auth.register.verifyingEmail,
        otp: formValues.otp,
      });
      dispatch(login({ userId: data.userId, token: data.token }));
      dispatch(SetSnackbar(true, 'success', data.message));
      dispatch(setRegisterEmail(''));
    } catch (error) {
      dispatch(SetSnackbar(true, 'error', (error as Error).message));
    } finally {
      dispatch(setRegisterLoading(false));
    }
  };
