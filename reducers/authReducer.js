import _ from 'lodash';
import axios from 'axios';

/// CONSTANTS and Configuration
const AUTH_REQUEST = 'AUTH_REQUEST';
const AUTH_RECEIVED = 'AUTH_RECEIVED';
const AUTH_FAILED = 'AUTH_FAILED';
const AUTH_SIGNOUT = 'AUTH_SIGNOUT';

const INITIAL_STATE = {
  loading: false,
  isAuthenticated: false,
  token: null,
  user: null,
};

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