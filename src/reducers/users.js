import { GET_USERS } from '../actions';

export default (users = [], action) => {
  switch (action.type) {
    case GET_USERS:
      console.log(action.payload);
      return action.payload;
    default:
      return users;
  }
};
