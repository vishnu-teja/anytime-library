import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import classes from './Header.css';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { ADD_USER } from './../../store/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as routerTypes from '../../constants/routes';
class Header extends Component {
  constructor(props) {
    super(props);
    const data = sessionStorage.getItem('user');
    const user = data ? JSON.parse(data) : null;
    this.props.onAddUser(user);
    this.state = {
      error: null,
      user: user,
      openMenu: false,
      login: false,
      anchorEl: null
    };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        this.setUserHandler(socialAuthUser);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  setUserHandler = userData => {
    const data = userData.additionalUserInfo.profile;
    let obj = {
      email: data.email,
      name: data.given_name,
      gender: data.gender,
      image: data.picture,
      id: data.id,
      isAdmin: false,
      books: [],
      history: [],
      ratings: []
    };
    axios
      .get(
        'https://anytime-library-cf928.firebaseio.com/users.json?orderBy="email"&equalTo="' +
          obj.email +
          '" '
      )
      .then(res => {
        if (!Object.values(res.data).length) {
          // const obj = {...obj, key: res.data}
          //check
          this.createUserHandler(obj);
          this.setUserDataHandler(obj);
        } else {
          obj = {
            ...Object.values(res.data)[0],
            key: Object.keys(res.data)[0]
          };
          this.setUserDataHandler(obj);
        }
      });
  };

  createUserHandler = userData => {
    axios
      .post('https://anytime-library-cf928.firebaseio.com/users.json', userData)
      .then(res => {});
  };

  setUserDataHandler = obj => {
    this.setState({ error: null });
    this.props.onAddUser(obj);
    if (this.props.store.user.email && !this.state.user)
      this.setState({ user: this.props.store.user, login: true });
    sessionStorage.setItem('user', JSON.stringify(obj));
  };

  closeMenuHandler = () => {
    this.setState({ openMenu: false });
  };

  openMenuHandler = () => {
    this.setState({ openMenu: true });
  };
  signOutHandler = () => {
    this.props.firebase.doSignOut();
    this.closeMenuHandler();
    sessionStorage.clear();
    this.setState({ user: null, login: false });
  };
  render() {
    console.log(this.props);
    return (
      <div className={classes.root}>
        {this.state.user ? (
          this.state.user.isAdmin ? (
            this.props.location.pathname !== routerTypes.ADMIN ? (
              <Redirect to={routerTypes.ADMIN} />
            ) : null
          ) : this.props.location.pathname !== routerTypes.USER ? (
            <Redirect to={routerTypes.USER} />
          ) : null
        ) : this.props.location.pathname !== routerTypes.HOME ? (
          <Redirect exact to={routerTypes.HOME} />
        ) : null}
        <AppBar position="static">
          <Toolbar>
            <Typography
              component="h2"
              variant="display2"
              className={classes.grow}
            >
              ATL
            </Typography>
            <Typography />

            {this.state.user ? (
              <div>
                <Avatar
                  src={this.state.user.image}
                  onClick={this.openMenuHandler}
                  className={classes.Avatar}
                  aria-haspopup="true"
                  aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                />
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={this.state.openMenu}
                  onClose={this.closeMenuHandler}
                >
                  <MenuItem onClick={this.signOutHandler}>SignOut</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button onClick={this.onSubmit} color="inherit">
                Login / SignUp
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    store: state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddUser: user => dispatch({ type: ADD_USER, payload: user })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
