// utils
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, StyleSheet, ListView, RefreshControl, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, List } from 'react-native-elements';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import _ from 'lodash';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// actions
import { fetchRides, updateRidesSearch, updateRidesFilters, clearRidesSearch, clearRidesFilters } from '../../../actions/rides';

// components
import { RenderActivityIndicator } from '../../../components/shared/render-activity-indicator/render-activity-indicator'
import { RidesIndexItem } from '../../../components/rides/rides-index-item/rides-index-item'
import { RenderRidesFilters } from '../../../components/rides/render-rides-filters/render-rides-filters'
import { RenderRidesSearch } from '../../../components/rides/render-rides-search/render-rides-search'

const per = 15
let page = 1
const styles = StyleSheet.create({
  emptyList: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyListContainer: {
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
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

  constructor(props, context) {
    super(props, context);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      data: [],
      dataSource: ds.cloneWithRows([]),
      refreshing: false,
      showSearch: false,
      showFilters: false,
    };
  }

  componentDidMount() {
    this.props.fetchRides(page, per)

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

  componentDidUpdate(prevProps) {
    const { rides } = this.props;

    if (rides !== prevProps.rides) {
      let newData = this.state.data.concat(rides)

      this.setState({
        data: newData,
        dataSource: this.state.dataSource.cloneWithRows(newData)
      })
    }
  }

  renderRidesList() {
    const { rides, isFetching, isStarted } = this.props;

    if (_.isEmpty(this.state.data) && isFetching) {
      return (
        <RenderActivityIndicator />
      )
    } else if (_.isEmpty(this.state.data)) {
      return(
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyList}>No rides</Text>
        </View>
      )
    } else {
      return (
        <ListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          dataSource={this.state.dataSource}
          renderRow={this.renderRide}
          canLoadMore={true}
          onLoadMoreAsync={this.loadMoreContentAsync.bind(this)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
        />
      )
    }
  }

  renderRide(ride) {
    return (
      <RidesIndexItem
        ride={ride}
        key={`ride${ride.id}`}
      />
    )
  }

  renderAddFloatingRideButton() {
    const { isAuthenticated, isFetching } = this.props;

    if (isAuthenticated && !(_.isEmpty(this.state.data) && isFetching)) {
      return (
        <ActionButton
          buttonColor="#23a2e3"
          onPress={() => Actions.rideNew()}
        />
      )
    }
  }

  loadMoreContentAsync = async () => {
    page = page + 1
    this.props.fetchRides(page, per)
  }

  canLoadMore() {
    parseInt(page, 10) < parseInt(this.props.pagination.total_pages, 10)
  }

  onRefresh() {
    this.props.fetchRides(1, per)
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

  clearRides() {
    this.setState({
      data: [],
      dataSource: this.state.dataSource.cloneWithRows([])
    })
  }

  render() {
    return (
      <View style={styles.view}>
        <View>
          {this.renderRidesSearch()}
          {this.renderRidesFilters()}
          {this.renderRidesList()}
        </View>
        {this.renderAddFloatingRideButton()}
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
  updateRidesSearch,
  updateRidesFilters,
  clearRidesSearch,
  clearRidesFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(RidesIndex)
