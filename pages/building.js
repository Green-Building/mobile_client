import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

class BuildingScreen extends Component {

  render() {
    const { isAuthenticated, navigation } = this.props;
    let buildingId = navigation.getParam('building_id', null);
    console.log("building_id is >>>", buildingId);
    return (
      <View style={styles.container}>
        <Text>Building Screen</Text>
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
  buttonContainer:{
    width: 200,
    backgroundColor: '#2980b6',
    paddingVertical: 15
  },
  buttonText:{
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
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


export default connect(mapStateToProps)(BuildingScreen);
