// utils
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Button, List } from 'react-native-elements';
import _ from 'lodash';

// actions
import { fetchCars, refreshCars } from '../../../actions/cars'

// components
import { RenderList } from '../../../components/shared/render-list/render-list'
import { CarsIndexItem } from '../../../components/cars/cars-index-item/cars-index-item'

const per = 20
const styles = StyleSheet.create({
  view: {
    marginTop: 60,
    flex: 1,
  },
});

class CarsIndex extends Component {
  static propTypes = {
    pagination: PropTypes.object.isRequired,
    cars: PropTypes.array.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object,
  }

  componentDidMount() {
    const { fetchCars, currentUser } = this.props

    if (currentUser.id) fetchCars(currentUser.id, 1, per)
  }

  refreshCars(per) {
    const { refreshCars, currentUser } = this.props

    refreshCars(currentUser.id, per)
  }

  fetchCars(page, per) {
    const { fetchCars, currentUser } = this.props

    fetchCars(currentUser.id, page, per)
  }

  renderCar(car) {
    return (
      <CarsIndexItem
        car={car}
        key={`car${car.id}`}
      />
    )
  }

  renderCarsList() {
    const { cars, isFetching, isStarted, pagination } = this.props;

    return (
      <RenderList
        items={cars}
        pagination={pagination}
        isFetching={isFetching}
        isStarted={isStarted}
        fetchItems={this.fetchCars.bind(this)}
        refreshItems={this.refreshCars.bind(this)}
        renderRow={this.renderCar}
        showAddButton={true}
        addButtonLink={() => Actions.carNew()}
        per={per}
        onEndReachedThreshold={200}
        emptyListText='No cars'
      />
    )
  }

  render() {
    return (
      <View style={styles.view}>
        {this.renderCarsList()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pagination: state.cars.pagination,
    cars: state.cars.items,
    isStarted: state.cars.isStarted,
    isFetching: state.cars.isFetching,
    currentUser: state.session.item,
  }
}

const mapDispatchToProps = {
  fetchCars,
  refreshCars,
}

export default connect(mapStateToProps, mapDispatchToProps)(CarsIndex)
