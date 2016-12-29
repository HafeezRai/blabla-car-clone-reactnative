// utils
import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { Provider, connect } from 'react-redux';
import { store } from './store/store';

// components
import AppDrawer from './containers/shared/app-drawer/app-drawer'
import Register from './containers/current-user/current-user-new/current-user-new'
import Login from './containers/session/login/login'
import RidesIndex from './containers/rides/rides-index/rides-index'
import RideShow from './containers/rides/ride-show/ride-show'

const RouterWithRedux = connect()(Router);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="drawer" component={AppDrawer} open={false}>
            <Scene key="main" >
              <Scene key="register" component={Register} title="Register" />
              <Scene key="login" component={Login} title="Login" />
              <Scene key="ridesIndex" component={RidesIndex} title="All rides" />
              <Scene key="rideShow" component={RideShow} />
            </Scene>
          </Scene>
        </RouterWithRedux>
      </Provider>
    );
  }
}

export default App;
