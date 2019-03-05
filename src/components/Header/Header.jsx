import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  MenuItem,
  Grid,
  Menu
} from '@material-ui/core';
import classes from './Header.css';
import axios from 'axios';
import { ADD_USER } from './../../store/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as routerTypes from '../../constants/routes';
import SnackBar from './../snackbar/snackbar';
class Header extends Component {
  constructor(props) {
    super(props);
    const data = sessionStorage.getItem('user');
    const user = data ? JSON.parse(data) : null;
    this.props.onAddUser(user);
    this.state = {
      error: false,
      user: user,
      openMenu: false,
      login: false,
      anchorEl: null,
      open: false,
      userLogin: null,
      openSnackBar: true,
      message: ''
    };
  }

  componentDidMount() {}

  onSubmit = event => {
    this.setState({ open: true });
  };

  tryAgain = () => {
    this.setState({ error: false });
  };

  loginWithGoogle = () => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        const data = socialAuthUser.additionalUserInfo.profile;
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
        this.setUserHandler(obj);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  updateUserLoginData = event => {
    const value = event.target.value;
    this.setState({
      userLogin: { ...this.state.userLogin, [event.target.id]: value }
    });
  };

  loginWithEmail = () => {
    if (
      this.state.userLogin &&
      this.state.userLogin.email &&
      this.state.userLogin.password
    ) {
      this.props.firebase
        .doSignInWithEmailAndPassword(
          this.state.userLogin.email,
          this.state.userLogin.password
        )
        .then(res => {
          this.createUserFromEmail(res);
        })
        .catch(err => {
          console.log(err);
          if (err.code === 'auth/user-not-found') {
            this.props.firebase
              .doCreateUserWithEmailAndPassword(
                this.state.userLogin.email,
                this.state.userLogin.password
              )
              .then(res => {
                this.createUserFromEmail(res);
              })
              .catch(err => {
                console.log(err);
              });
          } else if (err.code === 'auth/wrong-password') {
            this.setState({
              error: true,
              message: 'Invalid Credentials.'
            });
          }
        });
    } else {
      this.setState({ openSnackBar: true, message: 'Please fill the data.' });
    }
  };

  createUserFromEmail = data => {
    let obj = {
      email: data.user.email,
      name: data.user.email.split('@')[0],
      gender: null,
      image: null,
      id: data.user.uid,
      isAdmin: false,
      books: [],
      history: [],
      ratings: []
    };
    this.setUserHandler(obj);
  };

  setUserHandler = obj => {
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
      .then(res => {
        const obj = { ...userData, key: res.data.name };
        this.setUserDataHandler(obj);
      });
  };

  setUserDataHandler = obj => {
    this.props.onAddUser(obj);
    if (this.props.store.user.email)
      this.setState({ error: null, user: this.props.store.user, login: true });
    sessionStorage.setItem('user', JSON.stringify(obj));
    this.setState({ login: false, open: false });
  };

  closeMenuHandler = () => {
    this.setState({ anchorEl: null });
  };

  openMenuHandler = event => {
    this.setState({ anchorEl: event.currentTarget });
  };
  signOutHandler = () => {
    this.props.firebase.doSignOut();
    this.closeMenuHandler();
    sessionStorage.clear();
    this.setState({ user: null, login: false });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  closeHandler = close => {
    this.setState({ openSnackBar: close, message: '' });
  };
  // manageuserHandler = () => {
  //   const obj = { ...this.state.user, isAdmin: !this.state.user.isAdmin };
  //   this.setUserDataHandler(obj);
  //   this.setState({ user: obj });
  //   this.closeMenuHandler();
  // };
  render() {
    const { user } = this.state;
    return (
      <div className={classes.root}>
        {this.state.openSnackBar ? (
          <SnackBar
            open={this.state.openSnackBar}
            message={this.state.message}
            close={close => this.closeHandler(close)}
          />
        ) : null}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">SignUp/Login</DialogTitle>
          <DialogContent>
            {this.state.error ? (
              <div>
                <h1>Invalid Credentials</h1>
                <Button
                  onClick={this.tryAgain}
                  color="primary"
                  variant="outlined"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  onChange={e => this.updateUserLoginData(e)}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  onChange={e => this.updateUserLoginData(e)}
                  fullWidth
                />
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.loginWithEmail}
              color="primary"
              variant="outlined"
            >
              signup/login
            </Button>
            <p>or</p>
            <Button
              onClick={this.loginWithGoogle}
              color="primary"
              variant="contained"
            >
              Google signIn
            </Button>
          </DialogActions>
        </Dialog>
        {user ? (
          this.state.login ? (
            user.isAdmin ? (
              this.props.location.pathname !== routerTypes.ADMIN ? (
                <Redirect to={routerTypes.ADMIN} />
              ) : null
            ) : this.props.location.pathname !== routerTypes.USER ? (
              <Redirect to={routerTypes.USER} />
            ) : null
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
                <Grid container spacing={16}>
                  <Button
                    onClick={this.openMenuHandler}
                    color="inherit"
                    aria-haspopup="true"
                    aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                  >
                    {user.name}
                  </Button>
                  <Avatar src={user.image} className={classes.Avatar} />
                </Grid>
                <Menu
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
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
