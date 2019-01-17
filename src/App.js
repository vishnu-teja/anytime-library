import React, { Component } from 'react';
// import Grid from '@material-ui/core/Grid';
import AdminHome from './components/admin/admin-home/AdminHome';
// import SignIn from './components/SignIn/SignIn';
import { Route, HashRouter } from 'react-router-dom';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import { FirebaseContext } from './components/Firebase';

class App extends Component {
  state = {};

  render() {
    return (
      <HashRouter>
        <div>
          <FirebaseContext.Consumer>
            {firebase => <Header firebase={firebase} />}
          </FirebaseContext.Consumer>

          <Route exact path="/" component={Home} />
          <Route path="/admin" component={AdminHome} />
        </div>
      </HashRouter>
    );
  }
}

export default App;
