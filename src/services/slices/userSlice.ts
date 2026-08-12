import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';
import { RootState } from '../store';

interface UserState {
  isAuthChecked: boolean;
  user: TUser | null;
  loginError: string | null;
  loginRequest: boolean;
}

const initialState: UserState = {
  isAuthChecked: false,
  user: null,
  loginError: null,
  loginRequest: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const res = await loginUserApi({ email, password });
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const getUser = createAsyncThunk(
  'user/get',
  async () => await getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(userLogout());
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => await forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loginRequest = true;
        state.loginError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginRequest = false;
        state.loginError = action.error.message || 'Ошибка';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginRequest = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginRequest = false;
        state.loginError = action.error.message || 'Ошибка';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.loginRequest = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loginRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  }
});

export const { userLogout, authChecked } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => !!state.user.user;
export const selectUserLoading = (state: RootState) => state.user.loginRequest;
export const selectUserError = (state: RootState) => state.user.loginError;

export default userSlice.reducer;
