import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements'

import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';

class FloorScreen extends Component {
  state = {
    rooms: [],
    nodes: [],
    cluster:{},
  }

  componentDidMount() {
    const { isAuthenticated, navigation } = this.props;
    let floorId = navigation.getParam('floor_id', null);
    if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
      url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=floor,room,node,sensor`;
    } else {
      url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=room,node,sensor`;
    }

    return axios.get(url)
    .then(response => {
      let floor, cluster, rooms, nodes, sensors;
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        cluster = response.data;
        floor = cluster.floor;
        rooms = floor.rooms;
        nodes = cluster.nodes;
      } else {
        floor = response.data;
        cluster = floor.cluster;
        rooms = floor.rooms;//cluster.floor.rooms;
        nodes = _.compact(floor.nodes);
        sensors = _.compact(floor.sensors);
        _.forEach(nodes, node => {
          node.sensors = _.filter(sensors, {node_id: node.id}) || {};
        })
      }

      _.forEach(rooms, room => {
        room.node = _.find(nodes, {room_id: room.id}) || {};
      });
      this.setState({rooms, nodes, cluster});
    });
  }

  handlePress = (room) => {
    const { navigation } = this.props;
    navigation.navigate('RoomModalScreen', {
      room: room,
      cluster: this.state.cluster,
      handleDelete: this.handleDelete,
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
    });
  }
  /*
  handlePress = (room) => {
    const { navigation } = this.props;
    navigation.navigate('node', {
      node_id: room.node.id
    });
  }
  */

  handleDelete = (room) => {
    return axios.delete(`${INFRA_MANAGER_HOST}/nodes/${room.node.id}`)
    .then(response => {
      const { navigation } = this.props;
      let floorId = navigation.getParam('floor_id', null);
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=floor,room,node,sensor`;
      } else {
        url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=room,node,sensor`;
      }
      return axios.get(url);
    })
    .then(response => {
      let floor, cluster, rooms, nodes, sensors;
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        cluster = response.data;
        floor = cluster.floor;
        rooms = floor.rooms;
        nodes = cluster.nodes;
      } else {
        floor = response.data;
        cluster = floor.cluster;
        rooms = floor.rooms;//cluster.floor.rooms;
        nodes = _.compact(floor.nodes);
        sensors = _.compact(floor.sensors);
        _.forEach(nodes, node => {
          node.sensors = _.filter(sensors, {node_id: node.id}) || {};
        })
      }
      _.forEach(rooms, room => {
        room.node = _.find(nodes, {room_id: room.id}) || {};
      });
      this.setState({rooms, nodes, cluster});
    })
    .catch(err => {
      console.log('err is >>>', err);
    })
  }

  handleAdd = (newNode) => {
    return axios.post(`${INFRA_MANAGER_HOST}/nodes`, newNode)
    .then(response => {
      const { navigation } = this.props;
      let floorId = navigation.getParam('floor_id', null);
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=floor,room,node,sensor`;
      } else {
        url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=room,node,sensor`;
      }
      return axios.get(url);
    })
    .then(response => {
      let floor, cluster, rooms, nodes, sensors;
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        cluster = response.data;
        floor = cluster.floor;
        rooms = floor.rooms;
        nodes = cluster.nodes;
      } else {
        floor = response.data;
        cluster = floor.cluster;
        rooms = floor.rooms;//cluster.floor.rooms;
        nodes = _.compact(floor.nodes);
        sensors = _.compact(floor.sensors);
        _.forEach(nodes, node => {
          node.sensors = _.filter(sensors, {node_id: node.id}) || {};
        })
      }
      _.forEach(rooms, room => {
        room.node = _.find(nodes, {room_id: room.id}) || {};
      });
      this.setState({rooms, nodes, cluster});
    })
    .catch(err => {
      console.log('err is >>>', err);
    })
  }

  handleUpdate = (updatedNode) => {
    return axios.put(`${INFRA_MANAGER_HOST}/nodes/${updatedNode.id}`, _.omit(updatedNode, 'id'))
    .then(response => {
      const { navigation } = this.props;
      let floorId = navigation.getParam('floor_id', null);
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=floor,room,node,sensor`;
      } else {
        url = `${INFRA_MANAGER_HOST}/floors/${floorId}?fetch_nested=room,node,sensor`;
      }
      return axios.get(url);
    })
    .then(response => {
      let floor, cluster, rooms, nodes, sensors;
      if (INFRA_MANAGER_HOST.indexOf('v0') !== -1) {
        cluster = response.data;
        floor = cluster.floor;
        rooms = floor.rooms;
        nodes = cluster.nodes;
      } else {
        floor = response.data;
        cluster = floor.cluster;
        rooms = floor.rooms;//cluster.floor.rooms;
        nodes = _.compact(floor.nodes);
        sensors = _.compact(floor.sensors);
        _.forEach(nodes, node => {
          node.sensors = _.filter(sensors, {node_id: node.id}) || {};
        })
      }
      _.forEach(rooms, room => {
        room.node = _.find(nodes, {room_id: room.id}) || {};
      });
      this.setState({rooms, nodes, cluster});
    })
    .catch(err => {
      console.log('err is >>>', err);
    })
  }



  render() {
    const { isAuthenticated, navigation } = this.props;
    console.log("this.state is >>>", this.state.floors);
    return (
      <View style={styles.container}>
        {this.state.rooms.map((l, i) => (
          <ListItem
            onPress={() =>this.handlePress(l)}
            key={i}
            title={`floor# ${l.room_number}`}
            subtitle={l.node && 'Has Node'}
            badge={{ value: _.get(l, 'node.status', null), textStyle: { color: 'orange' }, containerStyle: { marginTop: -10 } }}
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


export default connect(mapStateToProps)(FloorScreen);
