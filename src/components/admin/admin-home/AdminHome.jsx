import React, { Component } from 'react';
import {
  Button,
  Input,
  Grid,
  Modal,
  Tab,
  Tabs,
  AppBar
} from '@material-ui/core';
import axios from 'axios';
import SnackBar from '../../snackbar/snackbar';
// import BookCard from '../../BookCard/BookCard';
import { connect } from 'react-redux';
import classes from './AdminHome.css';
import { ADD_BOOK } from './../../../store/actions';
import Library from './../../Library/Library';
import EditBook from '../EditBook/EditBook';
import BookCard from '../../BookCard/BookCard';

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
    message: '',
    disableAddButton: true,
    openEdit: false,
    editedBook: {},
    value: 0
  };

  componentDidMount() {
    this.setBooksHandler();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isbn !== prevState.isbn) {
      this.setBooksHandler();
    }
  }

  handleChange = (event, value) => {
    this.setState({ value: value });
  };

  setBooksHandler = () => {
    axios
      .get('https://anytime-library-cf928.firebaseio.com/books.json')
      .then(data => {
        if (data && data.data && Object.values(data.data).length) {
          this.setState({ books: data.data, openEdit: false });
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
        this.setState({ disableAddButton: true });
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
      this.setState({ disableAddButton: true });
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
        copies: 5,
        reviews: []
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
        this.setBooksHandler();
      });
  };

  enableAddButton = () => {
    if (this.inputRef.current.value) this.setState({ disableAddButton: false });
    else this.setState({ disableAddButton: true });
  };

  editBookHandler = book => {
    this.setState({ editedBook: book, openEdit: true });
  };

  closeEditHandler = () => {
    // this.setState({ openEdit: false });
  };

  updatedBookHandler = book => {
    console.log(book);
    axios
      .put(
        'https://anytime-library-cf928.firebaseio.com/books/' +
          book.key +
          '.json',
        book
      )
      .then(res => {
        this.setBooksHandler();
      });
  };

  render() {
    const books = Object.values(this.props.store.books);
    const { value } = this.state;
    return (
      <div>
        <Modal
          open={this.state.openEdit}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          className={classes.Modal}
        >
          <EditBook
            open={this.state.openEdit}
            book={this.state.editedBook}
            handleChange={data => this.updatedBookHandler(data)}
          />
        </Modal>
        <Grid
          container
          spacing={16}
          className={classes.AdminHome}
          onClick={this.closeEditHandler}
        >
          {this.state.open ? (
            <SnackBar
              open={this.state.open}
              message={this.state.message}
              close={close => this.closeHandler(close)}
            />
          ) : null}

          <Grid container>
            <AppBar
              position="static"
              color="default"
              className={classes.AppBar}
            >
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Library" />
                <Tab label="Issued Books" />
              </Tabs>
            </AppBar>
            {value === 0 && (
              <div>
                <Grid item xs={12}>
                  <Input
                    type="text"
                    inputRef={this.inputRef}
                    placeholder="Enter ISBN..."
                    onChange={this.enableAddButton}
                  />
                  <br />
                  <br />
                  <Button
                    variant="contained"
                    onClick={() => this.getBooksHandler()}
                    color="primary"
                    disabled={this.state.disableAddButton}
                  >
                    Add Book
                  </Button>
                </Grid>

                <Grid container spacing={16} justify="center">
                  {/*         */}

                  <Library
                    delete={key => this.deleteBookHandler(key)}
                    editBook={book => this.editBookHandler(book)}
                  />
                </Grid>
              </div>
            )}
            {value === 1 && (
              <div>
                {books.length ? (
                  books
                    .filter(bk => bk.issuedTo && bk.issuedTo.length)
                    .map(book => {
                      return (
                        <Grid
                          key={book.key}
                          item
                          xl={4}
                          className={classes.BookCard}
                        >
                          <BookCard
                            book={book}
                            delete={key => this.deleteBookHandler(key)}
                            isAdmin={this.state.isAdmin}
                            editBook={book => this.editBookHandler(book)}
                          />
                        </Grid>
                      );
                    })
                ) : (
                  <div />
                )}
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { store: state };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddBook: newBook => dispatch({ type: ADD_BOOK, payload: newBook })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminHome);
