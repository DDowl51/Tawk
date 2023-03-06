import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface AuthState {
  authenticated: boolean;
  userId: string;
  token: string;
  login: {
    loading: boolean;
  };
  register: {
    loading: boolean;
    verifyingEmail: string;
  };
}

const initialState: AuthState = {
  authenticated: false,
  userId: '',
  token: '',
  login: {
    loading: false,
  },
  register: {
    loading: false,
    verifyingEmail: '',
  },
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //- Login reducers
    setLoginLoading(state, action: PayloadAction<boolean>) {
      state.login.loading = action.payload;
    },
    login(state, action: PayloadAction<{ userId: string; token: string }>) {
      state.authenticated = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    logout(state) {
      state.authenticated = false;
      state.userId = '';
      state.token = '';
    },
    //- Register reducers
    setRegisterLoading(state, action: PayloadAction<boolean>) {
      state.register.loading = action.payload;
    },
    setRegisterEmail(state, action: PayloadAction<string>) {
      state.register.verifyingEmail = action.payload;
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const {
  login,
  logout,
  setLoginLoading,
  setRegisterLoading,
  setRegisterEmail,
} = slice.actions;
export default slice.reducer;
