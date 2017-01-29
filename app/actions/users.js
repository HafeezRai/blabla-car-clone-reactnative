import {
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_FETCH_FAILURE,
  USER_FETCH_REQUEST,
  USER_FETCH_SUCCESS,
  USER_FETCH_FAILURE,
} from '../constants/action-types'
import { APIEndpoints } from '../constants/constants'

export function fetchUsers(page = 1, per = 10) {
  return {
    types: [
      USERS_FETCH_REQUEST,
      USERS_FETCH_SUCCESS,
      USERS_FETCH_FAILURE
    ],
    payload: {
      request: {
        url: APIEndpoints.USERS,
        params: {
          page,
          per,
        }
      }
    }
  }
}

export function fetchUser(userId) {
  return {
    types: [
      USER_FETCH_REQUEST,
      USER_FETCH_SUCCESS,
      USER_FETCH_FAILURE
    ],
    payload: {
      request: {
        url: `${APIEndpoints.USERS}/${userId}`,
      }
    }
  }
}
