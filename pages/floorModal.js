import React, { Component } from 'react';
import _ from 'lodash';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';
class FloorModalScreen extends Component {
  state = {
    name: '',
    status: '',
  }
  componentDidMount() {
    const { isAuthenticated, navigation } = this.props;
    console.log("navigation.params >>>", navigation.getParam('floor', null));

  }
  render() {
    const { navigation } = this.props;
    let floor = navigation.getParam('floor', {});
    let handleDelete = navigation.getParam('handleDelete', _.noop);
    let handleAdd = navigation.getParam('handleAdd', _.noop);
    let handleUpdate = navigation.getParam('handleUpdate', _.noop);
    return (
      <View style={styles.container}>
        {_.isEmpty(floor.cluster) ?
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
            <Button title="Add" onPress={()=>{handleAdd(_.assign({}, this.state, {floor_id: floor.id, building_id: floor.building_id}));}} />

          </View>:
          <View style={styles.button}>
            <FormLabel>Name</FormLabel>
            <FormInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Name"
              onChangeText={name => {floor.cluster.name=name}}
              onSubmitEditing={() => this.statusInput.focus()}
              value={floor.cluster.name}
            />
            <FormLabel>Status</FormLabel>
            <FormInput
              autoCapitalize="none"
              ref={(input)=> this.statusInput = input}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="go"
              placeholder="Status"
              onChangeText={status => {floor.cluster.status=status}}
              value={floor.cluster.status}
            />
            <Button title="Update" onPress={()=>{handleUpdate(floor.cluster)}} />
            <Button title="delete" onPress={()=>handleDelete(floor)} />
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

export default FloorModalScreen