import React from 'react';
import { Provider } from 'react-redux';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { createBottomTabNavigator, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './configureStore';
import LoginScreen from './pages/login';
import SignupScreen from './pages/signup';
import NotFoundScreen from './pages/notFound';
import AuthLoadingScreen from './pages/authLoading';
import HomeScreen from './pages/home';
import BuildingScreen from './pages/building';
import FloorScreen from './pages/floor';
import NodeScreen from './pages/node';

import FloorModalScreen from './pages/floorModal';
import RoomModalScreen from './pages/roomModal';
import SensorModalScreen from './pages/sensorModal';

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


const contentNavigator = createStackNavigator({
  main: {
    screen: HomeScreen,
    navigationOptions: () => ({
      title: `Home`,
    }),
  },
  building: {
    screen: BuildingScreen,
    path: 'building/:building_id',
    // The action and route params are extracted from the path.

    navigationOptions: ({navigation}) => ({
      title: `Building ${navigation.getParam('building_id', null)}`,

    }),
  },
  FloorModalScreen: {
    screen: FloorModalScreen,
  },
  floor: {
    screen: FloorScreen,
    path: 'floor/:floor_id',
    // The action and route params are extracted from the path.

    navigationOptions: ({navigation}) => ({
      title: `Floor ${navigation.getParam('floor_id', null)}`,
    }),
  },
  RoomModalScreen: {
    screen: RoomModalScreen,
  },
  node: {
    screen: NodeScreen,
    path: 'node/:node_id',
    // The action and route params are extracted from the path.

    navigationOptions: ({navigation}) => ({
      title: `Node ${navigation.getParam('node_id', null)}`,
    }),
  },
  SensorModalScreen: {
    screen: SensorModalScreen,
  }
})

const MainNavigator = createSwitchNavigator({
  authLoading: AuthLoadingScreen,
  main: { screen: contentNavigator},
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