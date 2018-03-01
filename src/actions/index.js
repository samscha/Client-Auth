import axios from 'axios';
import { appKey } from '../config';
// Fixes an issue with axios and express-session where sessions
// would not persist between routes
axios.defaults.withCredentials = true;
// const ROOT_URL = 'http://localhost:5000';
const ROOT_URL = 'http://localhost:5000/api';

export const USER_REGISTERED = 'USER_REGISTERED';
export const USER_AUTHENTICATED = 'USER_AUTHENTICATED';
export const USER_UNAUTHENTICATED = 'USER_UNAUTHENTICATED';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const GET_USERS = 'GET_USERS';
export const CHECK_IF_AUTHENTICATED = 'CHECK_IF_AUTHENTICATED';
export const ADD_TOKEN = 'ADD_TOKEN';
export const REVOKE_TOKEN = 'REVOKE_TOKEN';

export const authError = error => {
  return {
    type: AUTHENTICATION_ERROR,
    payload: error,
  };
};

export const register = (username, password, confirmPassword, history) => {
  return dispatch => {
    if (password !== confirmPassword) {
      dispatch(authError('Passwords do not match'));
      return;
    }
    axios
      .post(`${ROOT_URL}/users`, { username, password })
      .then(() => {
        dispatch({
          type: USER_REGISTERED,
        });
        history.push('/signin');
      })
      .catch(() => {
        dispatch(authError('Failed to register user'));
      });
  };
};

export const login = (username, password, history) => {
  return dispatch => {
    axios
      .post(`${ROOT_URL}/login`, { username, password })
      .then(({ data }) => {
        localStorage.setItem(appKey, data.token);
        dispatch({
          type: USER_AUTHENTICATED,
        });
        history.push('/users');
      })
      .catch(() => {
        dispatch(authError('Incorrect username/password combo'));
      });
  };
};

export const logout = () => {
  localStorage.removeItem(appKey);
  return { type: USER_UNAUTHENTICATED };
};

export const getUsers = () => {
  return dispatch => {
    axios
      .get(`${ROOT_URL}/users`, {
        headers: { authorization: localStorage.getItem(appKey) },
      })
      .then(response => {
        dispatch({
          type: USER_AUTHENTICATED,
        });
        dispatch({
          type: GET_USERS,
          payload: response.data,
        });
      })
      .catch(() => {
        dispatch(authError('Failed to fetch users'));
      });
  };
};
