// utils
import React from 'react';
import DatePicker from 'react-native-datepicker';
import { Text, View, StyleSheet } from 'react-native';

// styles
import stylesColors from '../../../constants/colors';

const styles = StyleSheet.create({
  error: {
    color: stylesColors.error,
    marginLeft: 15,
    marginTop: 0,
    marginBottom: 5,
  },
  inputStyle: {
    height: 40,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
    paddingTop: 0,
    width: 190,
  },
  dateIcon: {
  },
  dateInput: {
    alignItems: 'flex-start',
    paddingLeft: 5,
  }
});

export const DatepickerField = ({ input, label, meta: { touched, error }, ...custom }) => (
  <View>
    <DatePicker
      style={styles.inputStyle}
      customStyles={{ dateIcon: styles.dateIcon, dateInput: styles.dateInput }}
      mode="date"
      date={input.value}
      placeholder={label}
      onDateChange={(value) => {input.onChange(value)}}
      format="DD-MM-YYYY"
      {...input}
      {...custom}
    />
    <Text style={styles.error}>{touched && error}</Text>
  </View>
);
