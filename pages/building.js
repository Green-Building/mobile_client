import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements'

import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';

class BuildingScreen extends Component {
  state ={
    building: {},
    floors: [],
  }

  componentDidMount() {
    const { navigation } = this.props;
    let buildingId = navigation.getParam('building_id', null);
    return axios.get(`${INFRA_MANAGER_HOST}/buildings/${buildingId}?fetch_nested=floor,cluster`)
    .then(buildingConfig => {
      let building = buildingConfig.data;
      _.forEach(building.floors, floor => {
        floor.cluster = _.find(building.clusters, {floor_id: floor.id}) || null;
      });
      let floors = _.sortBy(building.floors, ['floor_number']);
      this.setState({building, floors});
    })
  }

  handlePress = (floor) => {
    const { navigation } = this.props;
    console.log("this.floor is>>>", floor);
    navigation.navigate('FloorModalScreen', {
      floor: floor,
      handleDelete: this.handleDelete,
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
    });
    /*
    navigation.navigate('floor', {
      floor_id: floor.id
    });
    */
  }

  handleDelete = (floor) => {
    console.log("floor is >>>", floor);
    return axios.delete(`${INFRA_MANAGER_HOST}/clusters/${floor.cluster.id}`)
    .then(response => {
      const { navigation } = this.props;
      let buildingId = navigation.getParam('building_id', null);
      return axios.get(`${INFRA_MANAGER_HOST}/buildings/${buildingId}?fetch_nested=floor,cluster`)
    })
    .then(buildingConfig => {
      let building = buildingConfig.data;
      _.forEach(building.floors, floor => {
        floor.cluster = _.find(building.clusters, {floor_id: floor.id}) || null;
      });
      let floors = _.sortBy(building.floors, ['floor_number']);
      this.setState({building, floors});
    })
    .catch(err =>{
      console.log('err is >>>', err);
    })
  }

  handleAdd = (newCluster) => {
    return axios.post(`${INFRA_MANAGER_HOST}/clusters`, newCluster)
    .then(response => {
      const { navigation } = this.props;
      let buildingId = navigation.getParam('building_id', null);
      return axios.get(`${INFRA_MANAGER_HOST}/buildings/${buildingId}?fetch_nested=floor,cluster`)
    })
    .then(buildingConfig => {
      let building = buildingConfig.data;
      _.forEach(building.floors, floor => {
        floor.cluster = _.find(building.clusters, {floor_id: floor.id}) || null;
      });
      let floors = _.sortBy(building.floors, ['floor_number']);
      this.setState({building, floors});
    })
    .catch(err =>{
      console.log('err is >>>', err);
    })
  }

  handleUpdate = (updatedCluster) => {
    return axios.put(`${INFRA_MANAGER_HOST}/clusters/${updatedCluster.id}`, _.omit(updatedCluster, 'id'))
    .then(response => {
      const { navigation } = this.props;
      let buildingId = navigation.getParam('building_id', null);
      return axios.get(`${INFRA_MANAGER_HOST}/buildings/${buildingId}?fetch_nested=floor,cluster`)
    })
    .then(buildingConfig => {
      let building = buildingConfig.data;
      _.forEach(building.floors, floor => {
        floor.cluster = _.find(building.clusters, {floor_id: floor.id}) || null;
      });
      let floors = _.sortBy(building.floors, ['floor_number']);
      this.setState({building, floors});
    })
    .catch(err =>{
      console.log('err is >>>', err);
    })
  }

  render() {
    const { isAuthenticated, navigation } = this.props;
    return (
      <View style={styles.container}>
        {this.state.floors.map((l, i) => (
          <ListItem
            onPress={()=>this.handlePress(l)}
            key={i}
            title={`floor# ${l.floor_number}`}
            subtitle={l.cluster && 'Has Cluster'}
            badge={{ value: _.get(l, 'cluster.status', null), textStyle: { color: 'orange' }, containerStyle: { marginTop: -10 } }}
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
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
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
