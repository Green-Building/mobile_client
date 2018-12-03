import _ from 'lodash';
import axios from 'axios';
import Promise from 'bluebird';
import qs from 'qs';
import { purgeStoredState, persistStore } from 'redux-persist';

import { AUTH_HOST } from '../api-config';
import persistConfig from '../persistConfig';
import { AsyncStorage } from 'react-native';

/// CONSTANTS and Configuration
const AUTH_REQUEST = 'AUTH_REQUEST';
const AUTH_RECEIVED = 'AUTH_RECEIVED';
const AUTH_FAILED = 'AUTH_FAILED';
const AUTH_SIGNOUT = 'AUTH_SIGNOUT';

const INITIAL_STATE = {
  loading: false,
  isAuthenticated: false,
  token: null,
  user: {},
};

function startAuthentication() {
  return { type: AUTH_REQUEST };
}

function successLogin(token, user) {
  return {
    type: AUTH_RECEIVED,
    token,
    user,
  }
}

function errorLogin(error) {
  return {
    type: AUTH_FAILED,
    error,
  }
}

function successLogout() {

}

export const login = (email, password) => (dispatch, getState) => {
  dispatch(startAuthentication());
  const requestBody = {
    email,
    password,
  }
  return axios({
    method: 'post',
    url: `${AUTH_HOST}/auth/login`,
    data: qs.stringify(requestBody),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    const { token, user } = response.data;
    dispatch(successLogin(token, user));
    return {success: true};
  })
  .catch(err => {
    dispatch(errorLogin(err));
  })
};

export const logout = () => (dispatch, getState) => {
  return Promise.resolve(AsyncStorage.removeItem('auth')) //purgeStoredState(persistConfig);
  .then(() => {
    purgeStoredState(persistConfig);
    dispatch({
      type: AUTH_SIGNOUT,
    });
  })
}


// Reducer
export default function reducer(state = INITIAL_STATE, dispatchedAction = {}) {
  let newState;
  switch (dispatchedAction.type) {
    case AUTH_REQUEST:
      return _.assign({}, state, {
        loading: true,
      });
    case AUTH_RECEIVED:
      newState =  _.assign({}, state, {
        loading: false,
        isAuthenticated: true,
        token: dispatchedAction.token,
        user: dispatchedAction.user,
      });
      return newState;
    case AUTH_FAILED:
      return _.assign({}, state, {
        loading: false,
      });
    case AUTH_SIGNOUT:
      return INITIAL_STATE;
    default: return state;
  }
}