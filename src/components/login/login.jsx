import React, { Component } from 'react';

class Login extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="jumbotron text-center">
          <h1>Login</h1>
        </div>
        <label>UserName</label>
        <input type="text" name="username" />
        <label>Password</label>
        <input type="password" name="password" />
      </div>
    );
  }
}

export default Login;
