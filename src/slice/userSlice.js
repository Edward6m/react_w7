import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

const setCookie = (name, value, days) => {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; secure; samesite=strict`;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
};

const initialState = {
  userName: '',
  userId: '',
  token: getCookie('token') || '', // Get token from cookie
  isAuthenticated: !!getCookie('token'), // Authentication depends on token in cookie
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.token = action.payload.token;

      // Save token in cookie (with optional expiry time)
      setCookie('token', action.payload.token, 7);  // Cookie expires in 7 days
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userName = '';
      state.userId = '';
      state.token = '';
      state.isAuthenticated = false;

      // Remove token from cookie
      deleteCookie('token');
    },
    checkAuthStatus: (state, action) => {
      state.isAuthenticated = action.payload.login;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  checkAuthStatus,
} = userSlice.actions;

// Async thunk for login
export const loginUser = (username, password) => async (dispatch) => {
  if (typeof username !== 'string' || username.trim() === '') {
    dispatch(loginFailure('username is required and must be a valid string.'));
    return;
  }

  if (typeof password !== 'string' || password.trim() === '') {
    dispatch(loginFailure('Password is required and must be a valid string.'));
    return;
  }

  dispatch(loginStart());


  try {
    const res = await axios.post(`${BASE_URL}/v2/admin/signin`, { username, password });
    //console.log(res);

    if (res.data.success) {
      const { uid, token } = res.data;
      const userName = username;

      dispatch(loginSuccess({ userName, userId: uid, token }));
    } else {
      console.log(res.data.success);
      dispatch(loginFailure('登入失敗，請再試一次！'));
    }
  } catch (error) {
    console.log(error);
    dispatch(loginFailure('登入失敗，請再試一次！'));
  }
};

// Async thunk for checking authentication
export const checkAuthStatusAsync = () => async (dispatch) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_APP_URL}/users/check`);
    dispatch(checkAuthStatus(res.data));
  } catch (error) {
    console.error('Error checking authentication:', error); // Log the error
    dispatch(checkAuthStatus({ login: false }));
  }
};

export const userSelectData = (state) => state.user;

export default userSlice.reducer;
