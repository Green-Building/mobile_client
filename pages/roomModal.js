import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';
class RoomModalScreen extends Component {
  state = {
    name: '',
    status: '',
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
    let room = navigation.getParam('room', {});
    let cluster = navigation.getParam('cluster', {});
    let handleDelete = navigation.getParam('handleDelete', _.noop);
    let handleAdd = navigation.getParam('handleAdd', _.noop);
    let handleUpdate = navigation.getParam('handleUpdate', _.noop);
    return (
      <View style={styles.container}>
        {_.isEmpty(room.node) ?
          <View style={styles.button}>
            <FormLabel>Name</FormLabel>
            <FormInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Name"
              onChangeText={name => {this.setState({name})}}
              onSubmitEditing={() => this.statusInput.focus()}
              value={this.state.name}
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
            <Button title="Add" onPress={()=>{handleAdd(_.assign({}, this.state, {room_id: room.id, cluster_id: cluster.id}));}} />

          </View>:
          <View style={styles.button}>
            <FormLabel>Name</FormLabel>
            <FormInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Name"
              onChangeText={name => {room.node.name=name}}
              onSubmitEditing={() => this.statusInput.focus()}
              value={room.node.name}
            />
            <FormLabel>Status</FormLabel>
            <FormInput
              autoCapitalize="none"
              ref={(input)=> this.statusInput = input}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="go"
              placeholder="Status"
              onChangeText={status => {room.node.status=status}}
              value={room.node.status}
            />
            <Button title="Update" onPress={()=>{handleUpdate(room.node)}} />
            <Button title="Delete" onPress={()=>handleDelete(room)} />
            <Button title="Go to Floor" onPress={this.goToNode} />
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

export default RoomModalScreen;