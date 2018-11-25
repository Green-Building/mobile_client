import React from 'react';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './configureStore';
import LoginScreen from './pages/login';
import SignupScreen from './pages/signup';
import NotFoundScreen from './pages/notFound';
import AuthLoadingScreen from './pages/authLoading';
import HomeScreen from './pages/home';

const { persistor, store } = configureStore();

const AuthTab = createBottomTabNavigator({
    login: { screen: LoginScreen },
    signup: { screen: SignupScreen },
},{
  navigationOptions: {
    tabBarVisible: false,
  },
  lazyLoad: true,
});

const MainNavigator = createSwitchNavigator({
  authLoading: AuthLoadingScreen,
  main: { screen: HomeScreen},
  auth: AuthTab,
},{
  initialRouteName: 'authLoading',
});

class Root extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={<NotFoundScreen />}
          onBeforeLift={() => {}}
          persistor={persistor}
        >
          <MainNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Root;