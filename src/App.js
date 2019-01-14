import React, { Component } from 'react';
import axios from 'axios';
import classes from './App.css';
import AdminHome from './components/admin/admin-home/admin-home';

class App extends Component {
  componentDidMount() {
    axios
      .get(
        'https://www.googleapis.com/books/v1/volumes?q=isbn:' + this.state.isbn
      )
      .then(data => {
        console.log(data);
        this.setState({ book: data });
      });
  }

  state = {
    isbn: 9781451648546,
    book: null
  };
  render() {
    return (
      <div className={classes.App}>
        <AdminHome />
      </div>
    );
  }
}

export default App;
