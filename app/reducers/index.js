// utils
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// reducers
import { users } from './users';
import { user } from './user';
import { cars } from './cars';
import { car } from './car';
import { carOptions } from './car-options';
import { currentUser } from './current-user';
import { rides } from './rides';
import { ridesFilters } from './rides-filters';
import { ride } from './ride';
import { rideOptions } from './ride-options';
import { session } from './session';
import { notifications } from './notifications';

export default combineReducers({
  currentUser,
  users,
  user,
  cars,
  car,
  carOptions,
  rides,
  ridesFilters,
  ride,
  rideOptions,
  session,
  notifications,
  form: formReducer
});
