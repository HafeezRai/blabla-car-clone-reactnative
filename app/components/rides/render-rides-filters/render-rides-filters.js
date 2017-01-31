// utils
import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form'
import { Button } from 'react-native-elements';
import _ from 'lodash';

// components
import { SelectField } from '../../inputs/select-field/select-field';

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
  },
  selectField: {
    width: 105,
  },
  submitButton: {
    marginTop: 10,
    height: 30,
  },
  view: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
});

const ORDER_TYPES = [
  { label: 'newest', value: 'newest' },
  { label: 'oldest', value: 'oldest' },
  { label: 'recently added', value: 'recently_added' },
  { label: 'cheapest', value: 'cheapest' },
  { label: 'expensive', value: 'expensive' },
]
const CURRENCY_TYPES = [
  { label: 'PLN', value: 'pln' },
  { label: 'EUR', value: 'eur' },
  { label: 'USD', value: 'usd' },
]

export class RenderRidesFilters extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  }

  renderClearButton() {
    const { filters, clearFilters } = this.props;
    console.log(filters);

    if (!_.isEmpty(filters)) {
      return (
        <Button
          raised
          buttonStyle={styles.submitButton}
          title={'Clear'}
          backgroundColor='red'
          onPress={clearFilters}
        />
      )
    }
  }

  render() {
    const { ride, handleSubmit } = this.props;
    const orders = ORDER_TYPES.map((item) =>
      <Picker.Item
        key={item.value}
        value={item.value}
        label={item.label}
      />
    )
    const orderPlaceholder =
      <Picker.Item
        key="order-placeholder"
        value={null}
        label="order"
      />
    const currencies = CURRENCY_TYPES.map((item) =>
      <Picker.Item
        key={item.value}
        value={item.value}
        label={item.label}
      />
    )
    const currencyPlaceholder =
      <Picker.Item
        key="currency-placeholder"
        value={null}
        label="currency"
      />

    return (
      <View style={styles.view}>
        <View style={styles.filtersContainer}>
          <Field
            style={styles.selectField}
            name="order_by_type"
            label="Order"
            component={SelectField}
          >
            {[orderPlaceholder, ...orders]}
          </Field>
          <Field
            style={styles.selectField}
            name="currency"
            label="Currency"
            component={SelectField}
          >
            {[currencyPlaceholder, ...currencies]}
          </Field>
        </View>
        {this.renderClearButton()}
        <Button
          raised
          buttonStyle={styles.submitButton}
          title={'Filter'}
          backgroundColor='#23a2e3'
          onPress={handleSubmit}
        />
      </View>
    )
  }
}

RenderRidesFilters = reduxForm({
  form: 'RidesFiltersForm',
})(RenderRidesFilters)

RenderRidesFilters = connect(
  (state, props) => ({
    initialValues: props.filters
  })
)(RenderRidesFilters)

export default RenderRidesFilters
