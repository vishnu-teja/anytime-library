import { ALL_BOOKS } from './actions';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_BOOKS:
      return {
        ...action.payload
      };

    default:
      return state;
  }
};

export default reducer;
