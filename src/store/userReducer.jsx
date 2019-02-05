import * as actionTypes from './actions';

const initialState = {
  email: null,
  name: null,
  gender: null,
  image: null,
  id: null,
  isAdmin: false,
  books: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_USER:
      return {
        ...action.payload
      };

    case actionTypes.ISSUE_BOOK:
      return {
        ...action.payload
      };

    default:
      return state;
  }
};

export default reducer;
