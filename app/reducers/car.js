import {
  CAR_FETCH_REQUEST,
  CAR_FETCH_SUCCESS,
  CAR_CREATE_REQUEST,
  CAR_UPDATE_REQUEST,
} from '../constants/action-types'

export const initialState = {
  isStarted: false,
  isFetching: false,
  isSaving: false,
  item: undefined,
}

export function car(state = initialState, action) {
  let item
  switch (action.type) {
  case CAR_FETCH_REQUEST:
    console.log('CAR_FETCH_REQUEST')
    return {
      ...state,
      isStarted: true,
      isFetching: true
    };
  case CAR_FETCH_SUCCESS:
    console.log('CAR_FETCH_SUCCESS')
    item = action.payload.data
    return {
      ...state,
      isFetching: false,
      item: {
        ...item,
        places: item.places.toString()
      }
    };
  case CAR_CREATE_REQUEST:
    console.log('CAR_CREATE_REQUEST');
    return {
      ...state,
      isSaving: true
    };
  case CAR_UPDATE_REQUEST:
    console.log('CAR_UPDATE_REQUEST');
    return {
      ...state,
      isSaving: true
    };
  default:
    return state;
  }
}
