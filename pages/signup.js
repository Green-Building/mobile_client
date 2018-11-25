import React, { Component } from 'react';
import { connect } from 'react-redux';
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class SignupScreen extends Component {

  state = {
    email: '',
    password: '',
    name: '',
    user_type: '',
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password, name, user_type } = this.state;
  }

  gotoSignin(e) {
    e.preventDefault();
    const { navigation } = this.props;
    navigation.navigate('login');
  }

  componentDidMount() {
    const { isAuthenticated, navigation } = this.props;
    if (isAuthenticated) {
      navigation.navigate('main');
    }
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
              onSubmitEditing={() => this.nameInput.focus()}
              autoCorrect={false}
              keyboardType='email-address'
              returnKeyType="next"
              placeholder="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
            <FormLabel>Name</FormLabel>
            <FormInput
              style={styles.input}
              autoCapitalize="none" ref={(input)=> this.nameInput = input}
              onSubmitEditing={() => this.userTypeInput.focus()}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="Name"
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />
            <FormLabel>User Type</FormLabel>
            <FormInput
              style={styles.input}
              autoCapitalize="none" ref={(input)=> this.userTypeInput = input}
              onSubmitEditing={() => this.passwordInput.focus()}
              autoCorrect={false}
              keyboardType='default'
              returnKeyType="next"
              placeholder="User Type"
              onChangeText={user_type => this.setState({ user_type })}
              value={this.state.user_type}
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
              <Text style={styles.buttontext} >Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttoncontainer} onPress={e=>{this.gotoSignin(e)}}>
              <Text style={styles.buttontext} >Already Have an account?Log in here.</Text>
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

export default connect(mapStateToProps)(SignupScreen);