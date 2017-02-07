// utils
import React, { Component, PropTypes }  from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

// actions
import { fetchRideOptions, createRide } from '../../../actions/rides'

// components
import RideForm from '../../../components/rides/ride-form/ride-form'
import { AsyncContent } from '../../../components/shared/async-content/async-content'

const styles = StyleSheet.create({
  view: {
    marginTop: 60,
  }
});

export class RideNew extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    rideOptions: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.props.fetchRideOptions()
  }

  renderRideForm() {
    const { rideOptions, isSaving } = this.props

    return (
      <RideForm
        isSaving={isSaving}
        rideOptions={rideOptions}
        onSubmit={this.handleSubmit.bind(this)}
      />
    )
  }

  handleSubmit(data) {
    const { createRide } = this.props
    var body = new FormData()

    Object.keys(data).forEach((key) => {
      if (key == 'destination_location' || key == 'start_location') {
        body.append(key + '_address', data[key].address)
        body.append(key + '_latitude', data[key].latitude)
        body.append(key + '_longitude', data[key].longitude)
      } else {
        if (data[key]) { body.append(key, data[key]) }
      }
    })
    createRide(body)
      .then((response) => {
        let rideId = response.payload.data.id
        Actions.rideShow({rideId: rideId});
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
    isSaving: state.ride.isSaving,
    isFetching: state.rideOptions.isFetching,
    isStarted: state.rideOptions.isStarted,
    rideOptions: state.rideOptions,
  }
}

const mapDispatchToProps = {
  fetchRideOptions,
  createRide,
}

export default connect(mapStateToProps, mapDispatchToProps)(RideNew)
