import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import classes from './Header.css';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
class Header extends Component {
  state = { error: null, user: null, openMenu: false };
  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        console.log(socialAuthUser);
        this.setUserHandler(socialAuthUser);
        // this.setState({ error: null });
        // this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  setUserHandler = userData => {
    const data = userData.additionalUserInfo.profile;
    const obj = {
      email: data.email,
      name: data.given_name,
      gender: data.gender,
      image: data.picture,
      id: data.id
    };
    this.setState({ error: null, user: obj });
  };

  closeMenuHandler = () => {
    this.setState({ openMenu: false });
  };

  openMenuHandler = () => {
    this.setState({ openMenu: true });
  };
  render() {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              ATL
              <br />
              <Link to="/">Home</Link>
              <Link to="/admin">Admin</Link>
            </Typography>
            <Typography />

            {this.state.user ? (
              <div>
                <Avatar
                  src={this.state.user.image}
                  onClick={this.openMenuHandler}
                />
                <Menu
                  open={this.state.openMenu}
                  onClose={this.closeMenuHandler}
                >
                  <MenuItem onClick={this.closeMenuHandler}>Profile</MenuItem>
                  <MenuItem onClick={this.closeMenuHandler}>SignOut</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button onClick={this.onSubmit} color="inherit">
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
