import {
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_REFRESH_REQUEST,
  USERS_REFRESH_SUCCESS,
} from '../constants/action-types'
import { union } from 'ramda';

export const initialState = {
  isStarted: false,
  isFetching: false,
  items: [],
  pagination: {}
}

export function users(state = initialState, action) {
  let items, pagination
  switch (action.type) {
  case USERS_FETCH_REQUEST:
    console.log('USERS_FETCH_REQUEST');
    return {
      ...state,
      isStarted: true,
      isFetching: true,
    };
  case USERS_FETCH_SUCCESS:
    console.log('USERS_FETCH_SUCCESS');
    items = action.payload.data.items
    pagination = action.payload.data.meta
    return {
      ...state,
      isFetching: false,
      items: union(
        state.items,
        items,
      ),
      pagination: pagination
    };
  case USERS_REFRESH_REQUEST:
    console.log('USERS_REFRESH_REQUEST');
    return {
      ...state,
      isStarted: true,
      isFetching: true,
      items: [],
    };
  case USERS_REFRESH_SUCCESS:
    console.log('USERS_REFRESH_SUCCESS');
    items = action.payload.data.items
    pagination = action.payload.data.meta
    return {
      ...state,
      isFetching: false,
      items: items,
      pagination: pagination,
    };
  default:
    return state;
  }
}
