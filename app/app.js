// utils
import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import { store } from './store/store';
import { persistStore } from 'redux-persist';
import { AsyncStorage, Text } from 'react-native';

// components
import AppDrawer from './containers/shared/app-drawer/app-drawer'
import Register from './containers/current-user/current-user-new/current-user-new'
import CarsIndex from './containers/cars/cars-index/cars-index'
import CarShow from './containers/cars/car-show/car-show'
import CarNew from './containers/cars/car-new/car-new'
import CarEdit from './containers/cars/car-edit/car-edit'
import CurrentUserShow from './containers/current-user/current-user-show/current-user-show'
import CurrentUserEdit from './containers/current-user/current-user-edit/current-user-edit'
import Login from './containers/session/login/login'
import RidesIndex from './containers/rides/rides-index/rides-index'
import RidesIndexAsPassenger from './containers/rides/rides-index-as-passenger/rides-index-as-passenger'
import RidesIndexAsDriver from './containers/rides/rides-index-as-driver/rides-index-as-driver'
import RideShow from './containers/rides/ride-show/ride-show'
import RideNew from './containers/rides/ride-new/ride-new'
import RideEdit from './containers/rides/ride-edit/ride-edit'
import UsersIndex from './containers/users/users-index/users-index'
import UserShow from './containers/users/user-show/user-show'
import NotificationsIndex from './containers/notifications/notifications-index/notifications-index'
import requireAuth from './containers/shared/require-auth/require-auth'
import { RenderActivityIndicator } from './components/shared/render-activity-indicator/render-activity-indicator'

const RouterWithRedux = connect()(Router);

class App extends Component {
  state = {
    rehydrated: false
  }

   componentDidMount(){
     persistStore(store, { storage: AsyncStorage, whitelist: ['session'] }, () => {
       this.setState({ rehydrated: true })
     })
   }

  render() {
    if(!this.state.rehydrated){
      return <RenderActivityIndicator />
    } else {
      return (
        <Provider store={store}>
          <RouterWithRedux>
            <Scene key="drawer" component={AppDrawer} open={false}>
              <Scene key="main" >
                <Scene key="ridesIndex" component={RidesIndex} title="All rides" />
                <Scene key="login" component={Login} title="Login" />
                <Scene key="register" component={Register} title="Register" />
                <Scene key="myAccount" component={requireAuth(CurrentUserShow)} title="My Account" rightTitle="Edit" onRight={()=>Actions.myAccountEdit()} />
                <Scene key="myAccountEdit" component={requireAuth(CurrentUserEdit)} title="Edit Account" />
                <Scene key="myRidesAsPassenger" component={requireAuth(RidesIndexAsPassenger)} title="My rides as passenger" />
                <Scene key="myRidesAsDriver" component={requireAuth(RidesIndexAsDriver)} title="My rides as driver" />
                <Scene key="myNotifications" component={requireAuth(NotificationsIndex)} title="My notifications" />
                <Scene key="rideShow" component={RideShow} title="Ride" />
                <Scene key="rideNew" component={requireAuth(RideNew)} title="Add Ride" />
                <Scene key="rideEdit" component={requireAuth(RideEdit)} title="Edit Ride" />
                <Scene key="carsIndex" component={requireAuth(CarsIndex)} title="My cars" />
                <Scene key="carShow" component={requireAuth(CarShow)} title="Car" />
                <Scene key="carNew" component={requireAuth(CarNew)} title="Add car" />
                <Scene key="carEdit" component={requireAuth(CarEdit)} title="Edit car" />
                <Scene key="usersIndex" component={requireAuth(UsersIndex)} title="Users" />
                <Scene key="userShow" component={requireAuth(UserShow)} />
              </Scene>
            </Scene>
          </RouterWithRedux>
        </Provider>
      );
    }
  }
}

export default App;
