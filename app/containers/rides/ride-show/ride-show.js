// utils
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, Text, StyleSheet, Dimensions, TouchableHighlight, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import moment from 'moment';
import MapView from 'react-native-maps';
import Collapsible from 'react-native-collapsible';
import _ from 'lodash';

// actions
import { fetchRide } from '../../../actions/rides';
import { createRideRequest, changeRideRequest } from '../../../actions/ride-requests';

// components
import { AsyncContent } from '../../../components/shared/async-content/async-content'
import { RideRequestsIndex } from '../../../components/rides/ride-requests-index/ride-requests-index'
import { RenderUserProfile } from '../../../components/shared/render-user-profile/render-user-profile'
import { RenderCarInfo } from '../../../components/shared/render-car-info/render-car-info'
import { RenderRideOffer } from '../../../components/rides/render-ride-offer/render-ride-offer'
import { EditButton } from '../../../components/shared/edit-button/edit-button'

const styles = StyleSheet.create({
  view: {
    marginTop: 10,
    marginLeft: 10,
  },
  rideDetails: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  rideDestination: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  container: {
    height: 200,
    marginRight: 10,
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
const markerIDs = ['startCity', 'destinationCity'];
const { width, height } = Dimensions.get('window')

export class RideShow extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }

  static defaultProps = {
    currentUser: {},
    ride: {
      start_location: {},
      destination_location: {},
      car: {},
      driver: {}
    }
  }

  static navigationOptions = {
    header: ({ state }) => {
      return {
        title: state.params.myTitle,
        right: (
          <EditButton
            onClick={() => state.params.navigation.navigate('rideEdit', {id: state.params.id})}
            showEdit={state.params.showEdit}
          />
        )
      }
    }
  }

  state = {
    markers: [],
    hideMap: true,
  }

  componentWillMount() {
    const { fetchRide, navigation, ride } = this.props
    const id = navigation.state.params.id

    fetchRide(id)
  }

  componentDidUpdate(oldProps) {
    const { ride } = this.props;

    if (ride !== oldProps.ride) {
      this.setParams()
    }
  }

  setParams() {
    const { ride, navigation } = this.props;
    const title = `${ride.start_location.address} - ${ride.destination_location.address}`

    navigation.setParams({
      myTitle: title,
      id: ride.id,
      navigation: navigation,
      showEdit: this.showEdit()
    })
  }

  showEdit() {
    const { ride, currentUser } = this.props;

    return ride.driver.id === currentUser.id
  }

  fitToCoordinates(coordinates) {
    return (
      this.map.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: false,
      })
    )
  }

  coordinatesAreValid() {
    const { ride } = this.props

    return (
      !isNaN(ride.start_location.latitude) && !isNaN(ride.start_location.longitude) &&
        !isNaN(ride.destination_location.latitude) && !isNaN(ride.destination_location.longitude)
    )
  }

  createMarker(latitude, longitude) {
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };
  }

  createRideRequest(data) {
    const { createRideRequest, ride } = this.props

    createRideRequest(ride.id, data.places)
      .then((response) => {
        if (!response.error) {
          Alert.alert(
            'Ride request created',
            'We will notify you as soon as driver accept or reject your offer.',
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]
          )
        }
      })
  }

  changeRideRequest(rideRequestId, status) {
    const { changeRideRequest } = this.props

    changeRideRequest(rideRequestId, status)
  }

  toggleMap() {
    const { ride } = this.props;
    const coordinates = [
      this.createMarker(ride.start_location.latitude, ride.start_location.longitude),
      this.createMarker(ride.destination_location.latitude, ride.destination_location.longitude)
    ]

    if (this.coordinatesAreValid()) {
      this.setState({hideMap: !this.state.hideMap, markers: coordinates})
      setTimeout(() => {
        this.fitToCoordinates(coordinates);
      }, 500);
    }
  }

  renderRide() {
    const { ride } = this.props

    return (
      <View style={styles.rideDetails}>
        <Text style={styles.rideDestination}>
          {ride.start_location.address} - {ride.destination_location.address}
        </Text>
        <Text>{moment(ride.starts_date).format('DD.MM.YY H:MM')}</Text>
      </View>
    )
  }

  renderMapToggle() {
    return (
      <View>
        <TouchableHighlight
          underlayColor='white'
          onPress={() => this.toggleMap()}
        >
          <Text>{this.state.hideMap ? 'Show map' : 'Hide map'}</Text>
        </TouchableHighlight>
        <Collapsible collapsed={this.state.hideMap}>
          {this.renderMap()}
        </Collapsible>
      </View>
    )
  }

  renderMap() {
    const { ride } = this.props

    if (this.coordinatesAreValid()) {
      return (
        <View style={styles.container}>
          <MapView
            ref={ref => { this.map = ref; }}
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(ride.start_location.latitude),
              longitude: parseFloat(ride.start_location.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {this.state.markers.map((marker, i) => (
              <MapView.Marker
                key={i}
                coordinate={marker}
              />
            ))}
          </MapView>
        </View>
      )
    }
  }

  renderDriver() {
    const { ride, currentUser, navigation } = this.props

    if (!(ride.driver.id === currentUser.id)) {
      return(
        <RenderUserProfile
          user={ride.driver}
          navigation={navigation}
        />
      )
    }
  }

  renderCar() {
    const { ride, navigation } = this.props

    return(
      <RenderCarInfo
        car={ride.car}
        navigation={navigation}
      />
    )
  }

  renderOffer() {
    const { ride, currentUser } = this.props

    return(
      <RenderRideOffer
        ride={ride}
        currentUser={currentUser}
        handleSubmit={this.createRideRequest.bind(this)}
      />
    )
  }

  renderRideRequests() {
    const { ride, currentUser } = this.props

    if (ride.driver.id === currentUser.id && !_.isEmpty(ride.ride_requests)) {
      return(
        <RideRequestsIndex
          ride={ride}
          currentUser={currentUser}
          handleSubmit={this.changeRideRequest.bind(this)}
        />
      )
    }
  }

  render() {
    const { isFetching, isStarted } = this.props;

    return (
      <ScrollView style={styles.view}>
        <AsyncContent
          isFetching={isFetching || !isStarted}
        >
          {this.renderRide()}
          {this.renderMapToggle()}
          {this.renderDriver()}
          {this.renderCar()}
          {this.renderOffer()}
          {this.renderRideRequests()}
        </AsyncContent>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ride: state.ride.item,
    isStarted: state.ride.isStarted,
    isFetching: state.ride.isFetching,
    currentUser: state.session.item,
  }
};

const mapDispatchToProps = {
  fetchRide,
  createRideRequest,
  changeRideRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(RideShow)
