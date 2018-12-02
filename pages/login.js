import React, { Component } from 'react';
import { connect } from 'react-redux';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  TouchableOpacity
} from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';

import { login, logout } from '../reducers/authReducer';

const SCREEN_WIDTH = Dimensions.get('window').width;

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    const { navigation, login } = this.props;
    return Promise.resolve(login(email, password))
    .then(response => {
      console.log("response is >>>", response);
      navigation.navigate('main');
    })
  }

  gotoSignup(e) {
    e.preventDefault();
    const { navigation } = this.props;
    navigation.navigate('signup');
  }

  render() {
    const { isAuthenticated, navigation, intl } = this.props;
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginLogo}>
        </View>
        <View style={styles.loginForm}>
          <View style={styles.loginFormContainer}>
            <FormLabel>Email</FormLabel>
            <FormInput
              style={styles.input}
              autoCapitalize="none"
              onSubmitEditing={() => this.passwordInput.focus()}
              autoCorrect={false}
              keyboardType='email-address'
              returnKeyType="next"
              placeholder="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
            <FormLabel>Password</FormLabel>
            <FormInput
              style={styles.input}
              returnKeyType="go" ref={(input)=> this.passwordInput = input}
              placeholder="Password"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              secureTextEntry
            />
            <TouchableOpacity style={styles.buttoncontainer} onPress={e=>{this.handleSubmit(e)}}>
              <Text style={styles.buttontext}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttoncontainer} onPress={e=>{this.gotoSignup(e)}}>
              <Text  style={styles.buttontext}>Don't have an account? Register here.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,

  },
  loginLogo: {
    flex:1,
  },
  loginForm: {
    flex: 2,
  },
  loginFormContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255, 0.8)',
    paddingLeft: 10,
    marginBottom: 15,
  },
  buttoncontainer: {
    backgroundColor: '#23618C',
    marginTop: 10,
    paddingVertical: 15,
  },
  buttontext: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
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
    login: (email, password) => {
      dispatch(login(email, password));
    },
    logout: () => {
      dispatch(logout());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);