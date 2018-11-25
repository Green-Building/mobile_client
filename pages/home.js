import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { MapView } from 'expo';

class HomeScreen extends Component {

  logout(e){
    const { navigation } = this.props;
    //this.props.logout();
    navigation.navigate('login');
  }
  render() {
    const { isAuthenticated, navigation } = this.props;
    return (
      <View style={styles.container}>
        <MapView style={styles.mapContainer}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex:1,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
  },
  mapContainer:{
    width: 400,
    height: 600,
    backgroundColor: '#2980b6',
    paddingVertical: 15
  },
});

function mapStateToProps(state) {
  const { auth } = state;
  const { loading, isAuthenticated } = auth;
  return {
    loading,
    isAuthenticated
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => {
      dispatch(action.signout());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);