// utils
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// actions
import { fetchRides, refreshRides, updateRidesSearch, updateRidesFilters, clearRidesSearch, clearRidesFilters } from '../../../actions/rides';

// components
import { RenderList } from '../../../components/shared/render-list/render-list'
import { RidesIndexItem } from '../../../components/rides/rides-index-item/rides-index-item'
import { RenderRidesFilters } from '../../../components/rides/render-rides-filters/render-rides-filters'
import { RenderRidesSearch } from '../../../components/rides/render-rides-search/render-rides-search'

const per = 20
const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
  },
  view: {
    marginTop: 60,
    flex: 1,
  },
});

export class RidesIndex extends Component {
  static propTypes = {
    pagination: PropTypes.object.isRequired,
    rides: PropTypes.array.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    filters: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
  }

  state = {
    showSearch: false,
    showFilters: false,
  };

  componentDidMount() {
    this.props.fetchRides(1, per)

    Actions.refresh({
      renderRightButton: () => this.renderRightButton(),
    })
  }

  renderRightButton() {
    return (
      <View style={styles.filtersContainer}>
        <Icon.Button
          onPress={() => this.toggleSearch()}
          name="md-search"
          backgroundColor='transparent'
          underlayColor='transparent'
          color="#23a2e3"
          size={25}
        />
        <MaterialCommunityIcons.Button
          onPress={() => this.toggleFilters()}
          name="filter-variant"
          backgroundColor='transparent'
          underlayColor='transparent'
          color="#23a2e3"
          size={25}
        />
      </View>
    )
  }

  toggleSearch() {
    this.setState({showSearch: !this.state.showSearch})
  }

  toggleFilters() {
    this.setState({showFilters: !this.state.showFilters})
  }

  refreshRides(per) {
    this.props.refreshRides(per)
  }

  fetchRides(page, per) {
    this.props.fetchRides(page, per)
  }

  renderRide(ride) {
    return (
      <RidesIndexItem
        ride={ride}
        key={`ride${ride.id}`}
      />
    )
  }

  renderRidesList() {
    const { rides, isFetching, isStarted, pagination, isAuthenticated } = this.props;

    return (
      <RenderList
        items={rides}
        pagination={pagination}
        isFetching={isFetching}
        isStarted={isStarted}
        fetchItems={this.fetchRides.bind(this)}
        refreshItems={this.refreshRides.bind(this)}
        renderRow={this.renderRide}
        showAddButton={isAuthenticated}
        addButtonLink={() => Actions.rideNew()}
        per={per}
        onEndReachedThreshold={200}
        emptyListText='No rides'
      />
    )
  }

  renderRidesSearch() {
    const { search } = this.props;

    if (this.state.showSearch) {
      return (
        <RenderRidesSearch
          onSubmit={this.searchRides.bind(this)}
          clearSearch={this.clearSearch.bind(this)}
          search={search}
        />
      )
    }
  }

  renderRidesFilters() {
    const { filters } = this.props;

    if (this.state.showFilters) {
      return (
        <RenderRidesFilters
          onSubmit={this.filterRides.bind(this)}
          clearFilters={this.clearFilters.bind(this)}
          filters={filters}
        />
      )
    }
  }

  filterRides(data) {
    const { updateRidesFilters, fetchRides } = this.props;

    updateRidesFilters(data)
    this.clearRides()
    fetchRides(1, per)
  }

  searchRides(data) {
    const { updateRidesSearch, fetchRides } = this.props;

    updateRidesSearch(data)
    this.clearRides()
    fetchRides(1, per)
  }

  clearSearch() {
    const { fetchRides, clearRidesSearch } = this.props;

    clearRidesSearch()
    this.clearRides()
    fetchRides(1, per)
  }

  clearFilters() {
    const { fetchRides, clearRidesFilters } = this.props;

    clearRidesFilters()
    this.clearRides()
    fetchRides(1, per)
  }

  clearRides() {
    this.setState({
      data: [],
      dataSource: this.state.dataSource.cloneWithRows([])
    })
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
    pagination: state.rides.pagination,
    rides: state.rides.items,
    filters: state.ridesFilters.filters,
    search: state.ridesFilters.search,
    isStarted: state.rides.isStarted,
    isFetching: state.rides.isFetching,
    isAuthenticated: state.session.isAuthenticated,
  }
};

const mapDispatchToProps = {
  fetchRides,
  refreshRides,
  updateRidesSearch,
  updateRidesFilters,
  clearRidesSearch,
  clearRidesFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(RidesIndex)
