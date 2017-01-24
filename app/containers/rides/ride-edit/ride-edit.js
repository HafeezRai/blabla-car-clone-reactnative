// utils
import React, { Component, PropTypes }  from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';
import moment from 'moment';

// actions
import { fetchRideOptions, updateRide } from '../../../actions/rides'

// components
import RideForm from '../../../components/rides/ride-form/ride-form'
import { AsyncContent } from '../../../components/shared/async-content/async-content'

const styles = StyleSheet.create({
  view: {
    marginTop: 60,
  }
});

export class RideEdit extends Component {
  static propTypes = {
    ride: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isStarted: PropTypes.bool.isRequired,
    rideOptions: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { fetchRideOptions } = this.props;

    fetchRideOptions()
  }

  renderRideForm() {
    const { ride, rideOptions } = this.props

    return (
      <RideForm
        ride={ride}
        rideOptions={rideOptions}
        onSubmit={this.handleSubmit.bind(this)}
      />
    )
  }

  handleSubmit(data) {
    const { updateRide, ride } = this.props
    var body = new FormData()

    data =_.pick(data, [
      'id', 'start_city', 'destination_city', 'places', 'start_date', 'price', 'currency', 'car_id'
    ])

    Object.keys(data).forEach((key) => {
      if (key == 'destination_city' || key == 'start_city') {
        body.append(key, data[key].address)
        body.append(key + '_lat', data[key].latitude)
        body.append(key + '_lng', data[key].longitude)
      } else if (key == 'start_date') {
        body.append(key, moment(data[key]).format('DD-MM-YYYY h:mm'))
      } else {
        if (data[key]) { body.append(key, data[key]) }
      }
    })

    updateRide(body, data.id)
      .then((response) => {
        let rideId = response.payload.data.id
        Actions.pop({refresh: {...ride}});
      })
  }

  render() {
    const { isFetching, isStarted } = this.props

    return (
      <ScrollView style={styles.view}>
        <AsyncContent
          isFetching={isFetching || !isStarted}
        >
          {this.renderRideForm()}
        </AsyncContent>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ride: state.ride.item,
    isFetching: state.rideOptions.isFetching,
    isStarted: state.rideOptions.isStarted,
    rideOptions: state.rideOptions,
  }
}

const mapDispatchToProps = {
  fetchRideOptions,
  updateRide,
}

export default connect(mapStateToProps, mapDispatchToProps)(RideEdit)
