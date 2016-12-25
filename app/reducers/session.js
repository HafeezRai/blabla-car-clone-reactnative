import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../constants/action-types'

export const initialState = {
  isStarted: false,
  isFetching: false,
  errors: [],
  isAuthenticated: false,
  item: undefined,
}

export function session(state = initialState, action) {
  let item, errors
  switch (action.type) {
  case LOGIN_REQUEST:
    console.log('LOGIN_REQUEST');
    return {
      ...state,
      isStarted: true,
      isFetching: true,
    };
  case LOGIN_SUCCESS:
    console.log('LOGIN_SUCCESS');
    item = action.payload.data
    return {
      ...state,
      errors: [],
      isFetching: false,
      isAuthenticated: true,
      item: item,
    };
  case LOGIN_FAILURE:
    console.log('LOGIN_FAILURE');
    errors = action.error.response.data.error
    return {
      ...initialState,
      errors: [errors],
    };
  default:
    return state;
  }
}