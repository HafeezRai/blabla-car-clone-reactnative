// utils
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button } from 'react-native-elements';
import moment from 'moment';

// actions
import { fetchRide } from '../../../actions/rides';
import { createRideRequest } from '../../../actions/ride-requests';

// components
import { AsyncContent } from '../../../components/shared/async-content/async-content'
import { RenderUserProfile } from '../../../components/shared/render-user-profile/render-user-profile'
import { RenderCarInfo } from '../../../components/shared/render-car-info/render-car-info'
import { RenderRideOffer } from '../../../components/rides/render-ride-offer/render-ride-offer'

const styles = StyleSheet.create({
  view: {
    marginTop: 60,
    marginLeft: 10,
    marginRight: 10
  },
  rideDetails: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  rideDestination: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export class RideShow extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUserId: PropTypes.number,
  }

  static defaultProps = {
    currentUserId: {},
    ride: {
      start_city: {},
      destination_city: {},
      car: {},
      driver: {}
    }
  }

  componentDidMount() {
    const { rideId, fetchRide } = this.props

    fetchRide(rideId)
  }

  componentDidUpdate(oldProps) {
    const { ride } = this.props;

    if (ride !== oldProps.ride) {
      Actions.refresh({
        rideId: ride.id,
        title: `${ride.start_city.address} - ${ride.destination_city.address}`,
        rightTitle: this.renderRightTitle(),
        onRight: this.renderRightAction()
      })
    }
  }

  renderRightTitle() {
    const { ride, currentUserId } = this.props;

    if (ride.driver.id === currentUserId) {
      return "Edit"
    } else {
      return undefined
    }
  }

  renderRightAction() {
    const { ride, currentUserId } = this.props;

    if (ride.driver.id === currentUserId) {
      return () => Actions.rideEdit({rideId: ride.id})
    } else {
      return undefined
    }
  }

  renderRide() {
    const { ride } = this.props

    return (
      <View style={styles.rideDetails}>
        <Text style={styles.rideDestination}>
          {ride.start_city.address} - {ride.destination_city.address}
        </Text>
        <Text>{moment(ride.starts_date).format('DD.MM.YY H:MM')}</Text>
      </View>
    )
  }

  renderDriver() {
    return(
      <RenderUserProfile user={this.props.ride.driver} />
    )
  }

  renderCar() {
    return(
      <RenderCarInfo car={this.props.ride.car} />
    )
  }

  renderOffer() {
    return(
      <RenderRideOffer
        ride={this.props.ride}
        currentUserId={this.props.currentUserId}
        handleSubmit={this.createRideRequest.bind(this)}
      />
    )
  }

  createRideRequest(data) {
    const { createRideRequest, ride } = this.props

    createRideRequest(ride.id, data.places)
  }

  renderRightTitle() {
    const { ride, currentUserId } = this.props;

    if (ride.driver.id === currentUserId) {
      return "Edit"
    }
  }

  renderRightAction() {
    const { ride, currentUserId } = this.props;

    if (ride.driver.id === currentUserId) return () => Actions.rideEdit({rideId: ride.id})
  }

  render() {
    const { isFetching, isStarted } = this.props;

    return (
      <View style={styles.view}>
        <AsyncContent
          isFetching={isFetching || !isStarted}
        >
          {this.renderRide()}
          {this.renderDriver()}
          {this.renderCar()}
          {this.renderOffer()}
        </AsyncContent>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ride: state.ride.item,
    isStarted: state.ride.isStarted,
    isFetching: state.ride.isFetching,
    currentUserId: state.session.item.id,
  }
};

const mapDispatchToProps = {
  fetchRide,
  createRideRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(RideShow)
