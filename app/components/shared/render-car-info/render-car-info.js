// utils
import React, { PropTypes } from 'react'
import { View, Image, Text, TouchableHighlight, StyleSheet } from 'react-native';

// styles
import stylesColors from '../../../constants/colors';

const styles = (layout) => StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  car: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  primaryText: {
    color: stylesColors[layout].primaryText,
  },
  title: {
    color: stylesColors[layout].primaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  view: {
    marginTop: 10,
  },
});

export const RenderCarInfo = ({car, layout, onSubmit, navigation}) => {
  return (
  <View style={styles(layout).view}>
    <Text style={styles(layout).title}>Car</Text>
    <View style={styles(layout).container}>
      <TouchableHighlight
        underlayColor={stylesColors[layout].primaryBg}
        onPress={onSubmit}
      >
        <Image source={{uri: car.car_photo}} style={styles(layout).avatar} />
      </TouchableHighlight>
      <View>
        <Text style={styles(layout).primaryText}>{car.full_name}</Text>
        <Text style={styles(layout).primaryText}>{car.production_year}</Text>
      </View>
    </View>
  </View>
  )
}

RenderCarInfo.propTypes = {
  car: PropTypes.object.isRequired,
  layout: PropTypes.string.isRequired,
}
