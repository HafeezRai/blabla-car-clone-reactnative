// utils
import React, { Component, PropTypes } from 'react'
import { View, ScrollView, Image, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { connect } from 'react-redux'
import moment from 'moment';
import _ from 'lodash';

// styles
import stylesColors from '../../../constants/colors';

// actions
import { initializeUser, fetchUser } from '../../../actions/users';

// components
import { AsyncContent } from '../../../components/shared/async-content/async-content'
import { RenderUserAge } from '../../../components/shared/render-user-age/render-user-age'
import { RidesIndexItem } from '../../../components/rides/rides-index-item/rides-index-item'
import { CarsIndexItem } from '../../../components/cars/cars-index-item/cars-index-item'
import { EditButton } from '../../../components/shared/edit-button/edit-button'

const styles = (layout) => StyleSheet.create({
  avatar: {
    width: 110,
    height: 110,
    margin: 10,
    marginRight: 10,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: stylesColors[layout].userShowAvatarBorder,
  },
  userInfoContainer: {
    // backgroundColor: stylesColors[layout].userShowUserContainerBg,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    color: stylesColors[layout].primaryText,
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    // color: stylesColors[layout].userShowUserContainerText,
    color: stylesColors[layout].primaryText,
  },
  userInfo: {
    fontSize: 16,
    color: stylesColors[layout].primaryText,
    // color: stylesColors[layout].userShowUserContainerText,
  },
  view: {
    flex: 1,
    // marginTop: 0,
    // backgroundColor: stylesColors[layout].primaryBg,
  },
});

export class UserShow extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    isStarted: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired,
    layout: PropTypes.string.isRequired,
  }

  static defaultProps = {
    user: {
      rides_as_driver: [],
      cars: [],
    }
  }

  state = {
    showDetails: false
  }

  // static navigationOptions = {
  //   header: ({ state }) => {
  //     return {
  //       title: state.params.myTitle,
  //       right: (
  //         <EditButton
  //           layout={state.params.layout}
  //           onClick={() => state.params.navigation.navigate('myProfileEdit')}
  //           showEdit={state.params.showEdit}
  //         />
  //       )
  //     }
  //   }
  // }

  componentWillMount() {
    const { initializeUser, fetchUser, modalProps } = this.props;
    // const user = navigation.state.params.user
    // const layout = navigation.state.params.layout

    // this.setParams(user, layout)
    initializeUser(modalProps.user)
    fetchUser(modalProps.user.id)
  }

  // setParams(user, layout) {
  //   const { navigation } = this.props;
  //   const title = `${user.full_name} profile`

  //   navigation.setParams({
  //     myTitle: title,
  //     id: user.id,
  //     layout: layout,
  //     navigation: navigation,
  //     showEdit: this.showEdit(user)
  //   })
  // }

  // showEdit(user) {
  //   const { currentUser } = this.props;

  //   return user.id === currentUser.id
  // }

  toggleDetails() {
    console.log(this.state.showDetails);
    this.setState({ showDetails: !this.state.showDetails })
  }

  renderUserInfo() {
    const { user, layout } = this.props;

    return(
      <TouchableHighlight
        style={styles(layout).userInfoContainer}
        underlayColor='transparent'
        onPress={() => this.toggleDetails()}
      >
        <View>
          <Image source={{uri: user.avatar}} style={styles(layout).avatar} />
          <Text style={styles(layout).userName}>{user.full_name}</Text>
          <RenderUserAge user={user} style={styles(layout).userInfo} />
          <Text style={styles(layout).userInfo}>member since: {moment(user.created_at).format('DD.MM.YYYY')}</Text>
          <Text style={styles(layout).userInfo}>last seen at: {moment(user.last_seen_at || Date.now()).format('DD.MM.YYYY')}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderDetails() {
    const { showDetails } = this.state;

    if (showDetails) {
      return (
        <View>
          {this.renderRidesAsDriver()}
          {this.renderUserCars()}
        </View>
      )
    }
  }

  renderRidesAsDriver() {
    const { user, layout } = this.props

    if (!_.isEmpty(user.rides_as_driver)) {
      return (
        <View>
          <Text style={styles(layout).title}>Rides as driver</Text>
          {this.renderRidesAsDriverList()}
        </View>
      )
    }
  }

  renderRidesAsDriverList() {
    const { user, layout, navigation } = this.props

    return (
      user.rides_as_driver.map((ride, i) =>
        <RidesIndexItem
          key={`ride-${i}`}
          ride={ride}
          layout={layout}
          navigation={navigation}
          withCarPhoto={true}
        />
      )
    )
  }

  renderUserCars() {
    const { user, layout } = this.props

    if (!_.isEmpty(user.cars)) {
      return (
        <View>
          <Text style={styles(layout).title}>Cars</Text>
          {this.renderUserCarsList()}
        </View>
      )
    }
  }

  renderUserCarsList() {
    const { user, currentUser, layout, navigation } = this.props

    return (
      user.cars.map((car, i) =>
        <CarsIndexItem
          key={`car-${i}`}
          car={car}
          layout={layout}
          navigation={navigation}
          currentUser={currentUser}
        />
      )
    )
  }

  render() {
    const { layout } = this.props

    return (
      <ScrollView style={styles(layout).view}>
        {this.renderUserInfo()}
        {this.renderDetails()}
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.item,
    isStarted: state.user.isStarted,
    isFetching: state.user.isFetching,
    currentUser: state.session.item,
    layout: state.settings.layout,
  }
}

const mapDispatchToProps = {
  initializeUser,
  fetchUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserShow)
