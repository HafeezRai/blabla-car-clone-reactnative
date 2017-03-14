// utils
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';

// actions
import {
  fetchRidesAsPassenger,
  refreshRidesAsPassenger,
  setDefaultRidesAsPassengerPer,
} from '../../../actions/rides';

// components
import { RenderList } from '../../../components/shared/render-list/render-list'
import { RidesIndexItem } from '../../../components/rides/rides-index-item/rides-index-item'

const per = 20
const styles = (layout) => StyleSheet.create({
  view: {
    flex: 1,
  },
});

export class RidesIndexAsPassenger extends Component {
  static propTypes = {
    pagination: PropTypes.object.isRequired,
    rides: PropTypes.array.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
    layout: PropTypes.string.isRequired,
  }

  static navigationOptions = {
    tabBar: {
      label: 'Rides as passenger',
    }
  }

  componentWillMount() {
    const { refreshRidesAsPassenger, setDefaultRidesAsPassengerPer, currentUser } = this.props

    if (currentUser.id) {
      setDefaultRidesAsPassengerPer(per)
      refreshRidesAsPassenger(currentUser.id, this.initialPer())
    }
  }

  refreshRides(per) {
    const { refreshRidesAsPassenger, currentUser } = this.props

    if (currentUser.id) refreshRidesAsPassenger(currentUser.id, this.initialPer())
  }

  fetchRides(page, per) {
    const { fetchRidesAsPassenger, currentUser } = this.props

    if (currentUser.id) fetchRidesAsPassenger(currentUser.id, page, per)
  }

  initialPer() {
    const { rides } = this.props;

    if (rides.length >= 3 * per) {
      return 3 * per
    } else if (rides.length >= 2 * per) {
      return 2 * per
    } else {
      return per
    }
  }

  renderRide(ride) {
    const { layout, navigation } = this.props;

    return (
      <RidesIndexItem
        ride={ride}
        layout={layout}
        navigation={navigation}
        key={`ride${ride.id}`}
      />
    )
  }

  renderRidesList() {
    const { rides, isFetching, isStarted, layout, pagination } = this.props;

    return (
      <RenderList
        items={rides}
        pagination={pagination}
        isFetching={isFetching}
        isStarted={isStarted}
        fetchItems={this.fetchRides.bind(this)}
        refreshItems={this.refreshRides.bind(this)}
        renderRow={this.renderRide.bind(this)}
        per={per}
        layout={layout}
        onEndReachedThreshold={200}
        emptyListText='No rides as passenger'
      />
    )
  }

  render() {
    const { layout } = this.props;

    return (
      <View style={styles(layout).view}>
        {this.renderRidesList()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pagination: state.ridesAsPassenger.pagination,
    rides: state.ridesAsPassenger.items,
    isStarted: state.ridesAsPassenger.isStarted,
    isFetching: state.ridesAsPassenger.isFetching,
    isAuthenticated: state.session.isAuthenticated,
    currentUser: state.session.item,
    layout: state.settings.layout,
  }
};

const mapDispatchToProps = {
  fetchRidesAsPassenger,
  refreshRidesAsPassenger,
  setDefaultRidesAsPassengerPer,
};

export default connect(mapStateToProps, mapDispatchToProps)(RidesIndexAsPassenger)
