import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import axios from 'axios';
import Book from '../../book/book';
import SnackBar from '../../snackbar/snackbar';
import Grid from '@material-ui/core/Grid';

import classes from './AdminHome.css';

class AdminHome extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }
  state = {
    isbn: 0,
    books: {},
    newBook: null,
    isAdmin: true,
    open: false,
    message: ''
  };

  componentDidMount() {
    this.setBooksHandler();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isbn !== prevState.isbn) {
      this.setBooksHandler();
    }
  }

  setBooksHandler = () => {
    axios
      .get('https://anytime-library-cf928.firebaseio.com/books.json')
      .then(data => {
        if (data && data.data && Object.values(data.data).length) {
          this.setState({ books: data.data });
        }
      });
  };

  getBooksHandler = () => {
    axios
      .get(
        'https://www.googleapis.com/books/v1/volumes?q=isbn:' +
          this.inputRef.current.value
      )
      .then(res => {
        this.inputRef.current.value = null;

        this.createBookHandler(res);
      });
  };

  createBookHandler = data => {
    if (!data.data.totalItems) {
      this.setState({
        open: true,
        message: 'Please enter a valid ISBN number.'
      });
      this.inputRef.current.focus();
    } else {
      const bookInfo =
        data &&
        data.data &&
        data.data.items.length &&
        data.data.items[0].volumeInfo;
      const obj = {
        title: bookInfo.title,
        author: bookInfo.authors[0],
        rating: bookInfo.averageRating,
        category: bookInfo.categories[0],
        description: bookInfo.description,
        smallImage: bookInfo.imageLinks.smallThumbnail,
        largeImage: bookInfo.imageLinks.thumbnail,
        ratingsCount: bookInfo.ratingsCount,
        isbn: bookInfo.industryIdentifiers[0].identifier,
        copies: 5
      };

      const isbn = obj.isbn;
      const books = { ...this.state.books };
      const existingBook = Object.values(books).find(boo => boo.isbn === isbn);
      if (existingBook) {
        this.setState({ open: true, message: 'This book already exists.' });
      } else {
        // books.push(obj);
        this.setState({ newBook: obj });
        this.addBookHandler(this.state.newBook);
      }
    }
  };

  addBookHandler = () => {
    axios
      .post(
        'https://anytime-library-cf928.firebaseio.com/books.json',
        this.state.newBook
      )
      .then(res => {
        // console.log(res);
        this.setBooksHandler();
      });
  };

  closeHandler = close => {
    this.setState({ open: close, message: '' });
  };

  deleteBookHandler = key => {
    axios
      .delete(
        'https://anytime-library-cf928.firebaseio.com/books/' + key + '.json'
      )
      .then(res => {
        console.log(res);
        this.setBooksHandler();
      });
  };

  render() {
    return (
      <Grid container spacing={16} className={classes.AdminHome}>
        {this.state.open ? (
          <SnackBar
            open={this.state.open}
            message={this.state.message}
            close={close => this.closeHandler(close)}
          />
        ) : null}

        <Grid item xs={12}>
          <Input
            type="text"
            inputRef={this.inputRef}
            placeholder="Enter ISBN..."
          />
          <br />
          <br />
          <Button
            variant="contained"
            onClick={() => this.getBooksHandler()}
            color="primary"
          >
            Add Book
          </Button>
        </Grid>

        <Grid container spacing={8}>
          {Object.keys(this.state.books).length
            ? Object.keys(this.state.books).map(key => {
                return (
                  <Grid key={Math.random()} item xs={2}>
                    <Book
                      key={key}
                      id={key}
                      book={this.state.books[key]}
                      delete={key => this.deleteBookHandler(key)}
                    />
                  </Grid>
                );
              })
            : null}
        </Grid>
      </Grid>
    );
  }
}

export default AdminHome;
