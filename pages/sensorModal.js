import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';
class SensorModalScreen extends Component {
  state = {
    name: '',
    status: '',
    type: '',
  }
  componentDidMount() {
    const { isAuthenticated, navigation } = this.props;
    console.log("navigation.params >>>", navigation.getParam('room', null));

  }

  goToNode() {
    const { isAuthenticated, navigation } = this.props;
    let room = navigation.getParam('room', {});
    let cluster = navigation.getParam('cluster', {});
    navigation.navigate('node', {
      node_id: room.node.id,
    });
  }
  render() {
    const { navigation } = this.props;
    let node = navigation.getParam('node', {});
    let sensor = navigation.getParam('sensor', {});
    let handleDelete = navigation.getParam('handleDelete', _.noop);
    let handleAdd = navigation.getParam('handleAdd', _.noop);
    let handleUpdate = navigation.getParam('handleUpdate', _.noop);
    return (
      <View style={styles.container}>
        {_.isEmpty(sensor) ?
          <View style={styles.button}>
            <FormLabel>Name</FormLabel>
            <FormInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Name"
              onChangeText={name => {this.setState({name})}}
              onSubmitEditing={() => this.typeInput.focus()}
              value={this.state.name}
            />
            <FormLabel>Type</FormLabel>
            <FormInput
              autoCapitalize="none"
              ref={(input)=> this.typeInput = input}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Type"
              onChangeText={type => {this.setState({type})}}
              onSubmitEditing={() => this.statusInput.focus()}
              value={this.state.type}
            />
            <FormLabel>Status</FormLabel>
            <FormInput
              autoCapitalize="none"
              ref={(input)=> this.statusInput = input}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="go"
              placeholder="Status"
              onChangeText={status => {this.setState({status})}}
              value={this.state.status}
            />
            <Button title="Add" onPress={()=>{handleAdd(_.assign({}, this.state, {node_id: node.id, cluster_id: node.cluster_id}));}} />

          </View>:
          <View style={styles.button}>
            <FormLabel>Name</FormLabel>
            <FormInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Name"
              onChangeText={name => {sensor.name=name}}
              onSubmitEditing={() => this.typeInput.focus()}
              value={sensor.name}
            />
            <FormLabel>Type</FormLabel>
            <FormInput
              autoCapitalize="none"
              ref={(input)=> this.typeInput = input}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Type"
              onChangeText={type => {sensor.type=type}}
              onSubmitEditing={() => this.statusInput.focus()}
              value={sensor.type}
            />
            <FormLabel>Status</FormLabel>
            <FormInput
              autoCapitalize="none"
              ref={(input)=> this.statusInput = input}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="go"
              placeholder="Status"
              onChangeText={status => {sensor.status=status}}
              value={sensor.status}
            />
            <Button title="Update" onPress={()=>{handleUpdate(sensor)}} />
            <Button title="Delete" onPress={()=>handleDelete(sensor)} />
          </View>
        }
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
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

export default SensorModalScreen;