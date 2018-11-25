import { combineReducers } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import authReducer from './authReducer';

export default function getRootReducer(persistConfig) {
  return persistCombineReducers(persistConfig, {
    auth: authReducer,
  });
}