import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import FireBase, { FirebaseContext } from './components/Firebase/index';
import userReducer from './store/userReducer';
import booksReducer from './store/booksReducer';

const rootReducer = combineReducers({
  user: userReducer,
  books: booksReducer
});

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <FirebaseContext.Provider value={new FireBase()}>
      <App />
    </FirebaseContext.Provider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
