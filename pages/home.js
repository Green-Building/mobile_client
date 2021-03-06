import React, { Component } from 'react';
import _ from 'lodash';
import Promise from 'bluebird';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, ListItem, Button } from 'react-native-elements'
import { connect } from 'react-redux';
import { MapView, Image } from 'expo';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import {
  INFRA_MANAGER_HOST
} from '../api-config';

import { login, logout } from '../reducers/authReducer';

const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Button
          onPress={() => {
            return Promise.resolve(logout())
            .then(() => {
              navigation.navigate('login');
            })
          }}
          title="Logout"
        />
      ),
    };
  }

  state = {
    searched: false,
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  }

  goToBuildingScreen = (building) => {
    const { navigation } = this.props;
    //this.props.logout();
    console.log("pressed !!!")
    navigation.navigate('building', {
      building_id: building.id
    });
  }
  render() {
    const { isAuthenticated, navigation, token } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.searchboxContainer}>
          <GooglePlacesAutocomplete
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth:0
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#5d5d5d',
                fontSize: 16
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
            }}
            placeholder='Enter location'
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed='auto'    // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log("details is >>>", details.geometry.location);
              let location = details.geometry.location;
              let region = _.cloneDeep(this.state.region);
              region.latitude = location.lat;
              region.longitude = location.lng;
              return axios.get(`${INFRA_MANAGER_HOST}/buildings/search/geocode`,
              {
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
                params: {
                  latitude: region.latitude,
                  longitude:  region.longitude,
                  radius: 5,
                },
              })
              .then(response => {
                const buildings = response.data;
                console.log("buiildings>>>", buildings);
                _.forEach(buildings, building => {
                  building.position = {
                    latitude: building.latitude,
                    longitude: building.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
                });
                this.setState({region, markers: buildings, searched: true});
              })
            }}

            getDefaultValue={() => '1 Washington Street, San Jose'}

            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyBR8audAZcde2CziPeIvxy5n75kvGst41k',
              language: 'en', // language of the results
              types: 'geocode' // default: 'geocode'
            }}

            styles={{
              textInputContainer: {
                width: '100%'
              },
              description: {
                fontWeight: 'bold'
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              }
            }}

            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
            }}

            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            predefinedPlaces={[homePlace, workPlace]}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          />
        </View>
        <View style={styles.mapContainer}>
          <MapView style={{flex: 1}}
            region={this.state.region}
          >
            {this.state.searched && _.map(this.state.markers, marker => {
                return (
                  <MapView.Marker
                    key={marker.id}
                    coordinate={marker.position}
                    title="title"
                    description="description"
                  >
                    <MapView.Callout onPress={()=>this.goToBuildingScreen(marker)}>
                      <Card
                        title='Building'
                        style={{width: 50, height: 50}}
                        image={{uri: marker.image_url}}
                        style={{width: 200}}
                      >
                        <Text style={{width: 200}}>
                          {marker.address}
                        </Text>
                      </Card>
                    </MapView.Callout>
                  </MapView.Marker>
                )})
            }
          </MapView>
        </View>
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
  searchboxContainer: {
    top: 50,
    flex: 1,
  },
  mapContainer:{
    flex: 3,
    width: 400,
    height: 500,
    paddingVertical: 15
  },
});

function mapStateToProps(state) {
  const { auth } = state;
  const { loading, isAuthenticated, token } = auth;
  return {
    loading,
    isAuthenticated,
    token
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: () => {
      dispatch(logout());
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);