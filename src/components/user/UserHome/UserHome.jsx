import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, AppBar } from '@material-ui/core';
import classes from './UserHome.css';
import Profile from './../Profile/Profile';
import Library from '../../Library/Library';

class UserHome extends Component {
  state = { value: 0 };
  handleChange = (event, value) => {
    this.setState({ value: value });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
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
        {value === 1 && <Profile user={this.props.store.user} />}
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

export default connect(mapStateToProps)(UserHome);
