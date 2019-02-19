import React, { Component } from 'react';
// import Grid from '@material-ui/core/Grid';
import AdminHome from './components/admin/admin-home/AdminHome';
// import SignIn from './components/SignIn/SignIn';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Header from './components/Header/Header';
import { FirebaseContext } from './components/Firebase';
import { connect } from 'react-redux';
import Book from './components/Book/Book';
import UserHome from './components/user/UserHome/UserHome';
import classes from './App.css';
import * as routerConstants from './constants/routes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
class App extends Component {
  state = {};

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <FirebaseContext.Consumer>
              {firebase => (
                <div className={classes.Header}>
                  <Route
                    path="/"
                    render={props => <Header firebase={firebase} {...props} />}
                  />
                </div>
              )}
            </FirebaseContext.Consumer>

            <div className={classes.Body}>
              <Switch>
                <Route exact path={routerConstants.HOME} component={Home} />
                <Route path="/book/:id" component={Book} />

                {this.props.store.user.isAdmin ? (
                  <Switch>
                    <Route path={routerConstants.ADMIN} component={AdminHome} />

                    <Route path="*" render={() => <Redirect to="/admin" />} />
                  </Switch>
                ) : (
                  <Switch>
                    <Route path={routerConstants.USER} component={UserHome} />

                    <Route path="*" render={() => <Redirect to="/user" />} />
                  </Switch>
                )}

                <Route path="/header" component={Header} />
              </Switch>
            </div>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    store: state
  };
};

export default connect(mapStateToProps)(App);
