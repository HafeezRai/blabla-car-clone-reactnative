// utils
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';

// actions
import { fetchRidesAsDriver, refreshRidesAsDriver } from '../../../actions/rides';

// components
import { RenderList } from '../../../components/shared/render-list/render-list'
import { RidesIndexItem } from '../../../components/rides/rides-index-item/rides-index-item'

const per = 20
const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export class RidesIndexAsDriver extends Component {
  static propTypes = {
    pagination: PropTypes.object.isRequired,
    rides: PropTypes.array.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }

  static navigationOptions = {
    tabBar: {
      label: 'Rides as driver'
    }
  }

  componentWillMount() {
    const { refreshRidesAsDriver, currentUser } = this.props

    if (currentUser.id) refreshRidesAsDriver(currentUser.id, per)
  }

   refreshRides(per) {
    const { refreshRidesAsDriver, currentUser } = this.props

    if (currentUser.id) refreshRidesAsDriver(currentUser.id, per)
  }

  fetchRides(page, per) {
    const { fetchRidesAsDriver, currentUser } = this.props

    if (currentUser.id) fetchRidesAsDriver(currentUser.id, page, per)
  }

  renderRide(ride) {
    const { navigation } = this.props;

    return (
      <RidesIndexItem
        ride={ride}
        navigation={navigation}
        key={`ride${ride.id}`}
      />
    )
  }

  renderRidesList() {
    const { rides, isFetching, isStarted, pagination, navigation } = this.props;

    return (
      <RenderList
        items={rides}
        pagination={pagination}
        isFetching={isFetching}
        isStarted={isStarted}
        fetchItems={this.fetchRides.bind(this)}
        refreshItems={this.refreshRides.bind(this)}
        renderRow={this.renderRide.bind(this)}
        showAddButton={true}
        addButtonLink={() => navigation.navigate('rideNew')}
        per={per}
        onEndReachedThreshold={200}
        emptyListText='No rides as driver'
      />
    )
  }

  render() {
    return (
      <View style={styles.view}>
        {this.renderRidesList()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pagination: state.ridesAsDriver.pagination,
    rides: state.ridesAsDriver.items,
    isStarted: state.ridesAsDriver.isStarted,
    isFetching: state.ridesAsDriver.isFetching,
    isAuthenticated: state.session.isAuthenticated,
    currentUser: state.session.item,
  }
};

const mapDispatchToProps = {
  fetchRidesAsDriver,
  refreshRidesAsDriver,
};

export default connect(mapStateToProps, mapDispatchToProps)(RidesIndexAsDriver)
