import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, AppBar } from '@material-ui/core';
import classes from './UserHome.css';
import Profile from './../Profile/Profile';
import Library from '../../Library/Library';
import axios from 'axios';
import { ADD_FAVORITE } from '../../../store/actions';
import SnackBar from './../../snackbar/snackbar';

class UserHome extends Component {
  state = { value: 0, open: false, message: null };
  handleChange = (event, value) => {
    this.setState({ value: value });
  };

  addFavoriteHandler = category => {
    const user = { ...this.props.store.user, favoriteCategory: category };
    axios
      .put(
        'https://anytime-library-cf928.firebaseio.com/users/' +
          user.key +
          '.json',
        user
      )
      .then(res => {
        console.log(res);
        this.props.onAddFavorite(user);

        this.setState({ open: true, message: 'Favorite added successfully!' });
        sessionStorage.setItem('user', JSON.stringify(user));
      });
  };

  closeHandler = close => {
    this.setState({ open: close, message: '' });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        {this.state.open ? (
          <SnackBar
            open={this.state.open}
            message={this.state.message}
            close={close => this.closeHandler(close)}
          />
        ) : null}
        <AppBar position="static" color="default" className={classes.AppBar}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Library" />
            <Tab label="My Profile" />
          </Tabs>
        </AppBar>
        {value === 1 && (
          <Profile
            user={this.props.store.user}
            books={this.props.store.books}
            addFavorite={category => this.addFavoriteHandler(category)}
          />
        )}
        {value === 0 && <Library />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    store: state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddFavorite: user => dispatch({ type: ADD_FAVORITE, payload: user })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserHome);
