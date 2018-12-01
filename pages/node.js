import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements'

import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';

class NodeScreen extends Component {
  state = {
    node: {},
    sensors: [],
  }

  componentDidMount() {
    const { isAuthenticated, navigation } = this.props;
    let nodeId = navigation.getParam('node_id', null);

    return axios.get(`${INFRA_MANAGER_HOST}/nodes/${nodeId}?fetch_nested=sensor`)
    .then(response => {
      let node = response.data;
      let sensors = node.sensors;
      this.setState({node, sensors});
    });
  }

  render() {
    const { isAuthenticated, navigation } = this.props;
    console.log("this.state is >>>", this.state.floors);
    return (
      <View style={styles.container}>
        {this.state.sensors.map((l, i) => (
          <ListItem
            key={i}
            title={`sensor# ${l.id}`}
            subtitle={l.type}
            badge={{ value: l.status, textStyle: { color: 'orange' }, containerStyle: { marginTop: -10 } }}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex:1,
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


export default connect(mapStateToProps)(NodeScreen);
