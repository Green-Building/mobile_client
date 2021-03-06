import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.checkAuthed();
  }

  // Fetch the token from storage then navigate to our appropriate place
  checkAuthed = () => {
    const { isAuthenticated, navigation } = this.props;
    if (isAuthenticated) {
      navigation.navigate('main');
    } else {
      navigation.navigate('auth');
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
  },
});

function mapStateToProps(state) {
  const { auth } = state;
  const { isAuthenticated } = auth;
  return {
    isAuthenticated
  };
}

export default connect(mapStateToProps)(LoadingScreen);