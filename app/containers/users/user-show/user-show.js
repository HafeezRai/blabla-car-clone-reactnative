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
import { updateModal } from '../../../actions/modals';

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
  modalStylesExpanded: {
    marginTop: 0,
    backgroundColor: stylesColors[layout].secondaryBg,
  },
  userInfoContainer: {
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
    color: stylesColors[layout].primaryText,
  },
  userInfo: {
    fontSize: 16,
    color: stylesColors[layout].primaryText,
  },
  view: {
    flex: 1,
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

  componentWillMount() {
    const { initializeUser, fetchUser, modalProps } = this.props;

    if (modalProps.showDetails) this.setState({ showDetails: true })
    initializeUser(modalProps.user)
    fetchUser(modalProps.user.id)
  }

  expandUserModal() {
    const { updateModal, user, layout } = this.props;

    updateModal({
      user: user, layout: layout, modalStyles: styles(layout).modalStylesExpanded
    })
  }

  toggleDetails() {
    if (this.props.modalProps.showDetails === true) return
    this.setState({ showDetails: !this.state.showDetails })
    this.expandUserModal()
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
          <RenderUserAge user={user} layout={layout} />
          <Text style={styles(layout).userInfo}>
            member since: {moment(user.created_at).format('DD.MM.YYYY')}
          </Text>
          <Text style={styles(layout).userInfo}>
            last seen at: {moment(user.last_seen_at || Date.now()).format('DD.MM.YYYY')}
          </Text>
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
    const { user, layout, modalProps } = this.props

    return (
      user.rides_as_driver.map((ride, i) =>
        <RidesIndexItem
          key={`ride-${i}`}
          ride={ride}
          layout={layout}
          navigation={modalProps.navigation}
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
    const { user, currentUser, layout, modalProps } = this.props

    return (
      user.cars.map((car, i) =>
        <CarsIndexItem
          key={`car-${i}`}
          car={car}
          layout={layout}
          navigation={modalProps.navigation}
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
    modalProps: state.modal.modalProps,
  }
}

const mapDispatchToProps = {
  initializeUser,
  fetchUser,
  updateModal,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserShow)
