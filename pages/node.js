import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
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
    const { isAuthenticated, navigation, token } = this.props;
    let nodeId = navigation.getParam('node_id', null);

    return axios.get(`${INFRA_MANAGER_HOST}/nodes/${nodeId}?fetch_nested=sensor`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    .then(response => {
      let node = response.data;
      let sensors = node.sensors;
      this.setState({node, sensors});
    });
  }

  handlePress = (sensor) => {
    const { navigation } = this.props;
    navigation.navigate('SensorModalScreen', {
      node: this.state.node,
      sensor: sensor,
      handleDelete: this.handleDelete,
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
    });
  }

  handleDelete = (sensor) => {
    const { token } = this.props;
    return axios.delete(`${INFRA_MANAGER_HOST}/sensors/${sensor.id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    .then(response => {
      const { navigation } = this.props;
      let nodeId = navigation.getParam('node_id', null);
      return axios.get(`${INFRA_MANAGER_HOST}/nodes/${nodeId}?fetch_nested=sensor`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
    })
    .then(response => {
      let node = response.data;
      let sensors = node.sensors;
      this.setState({node, sensors});
    })
    .catch(err =>{
      console.log('err is >>>', err);
    })
  }

  handleAdd = (newSensor) => {
    const { token } = this.props;
    return axios.post(`${INFRA_MANAGER_HOST}/sensors`, newSensor, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    .then(response => {
      const { navigation } = this.props;
      let nodeId = navigation.getParam('node_id', null);
      return axios.get(`${INFRA_MANAGER_HOST}/nodes/${nodeId}?fetch_nested=sensor`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
    })
    .then(response => {
      let node = response.data;
      let sensors = node.sensors;
      this.setState({node, sensors});
    })
    .catch(err =>{
      console.log('err is >>>', err);
    })
  }

  handleUpdate = (sensor) => {
    const { token } = this.props;
    console.log("token in handleupdate is >>>", token)
    return axios.put(`${INFRA_MANAGER_HOST}/sensors/${sensor.id}`, sensor, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    })
    .then(response => {
      const { navigation } = this.props;
      let nodeId = navigation.getParam('node_id', null);
      return axios.get(`${INFRA_MANAGER_HOST}/nodes/${nodeId}?fetch_nested=sensor`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
    })
    .then(response => {
      let node = response.data;
      let sensors = node.sensors;
      this.setState({node, sensors});
    })
    .catch(err =>{
      console.log('err is >>>', err);
    })
  }

  render() {
    const { isAuthenticated, navigation } = this.props;
    console.log("this.state is >>>", this.state.floors);
    return (
      <View style={styles.container}>
        {this.state.sensors.map((l, i) => (
          <ListItem
            onPress={() =>this.handlePress(l)}
            key={i}
            title={`sensor# ${l.id}`}
            subtitle={l.type}
            badge={{ value: l.status, textStyle: { color: 'orange' }, containerStyle: { marginTop: -10 } }}
          />
        ))}
        <Button title="Add Sensor" onPress={() =>this.handlePress(null)} />
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
  const { loading, isAuthenticated, token } = auth;
  return {
    loading,
    isAuthenticated,
    token,
  };
}


export default connect(mapStateToProps)(NodeScreen);
