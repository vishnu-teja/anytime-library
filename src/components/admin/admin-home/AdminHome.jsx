import React, { Component } from 'react';
import {
  Button,
  // Input,
  Grid,
  Modal,
  Tab,
  Tabs,
  AppBar,
  // Typography,
  CircularProgress
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
  state = {
    // bookKey: 0,
    books: {},
    newBook: null,
    isAdmin: true,
    open: false,
    message: '',
    disableAddButton: true,
    openEdit: false,
    editedBook: {},
    value: 0,
    loading: true,
    type: null
  };

  componentDidMount() {
    this.setBooksHandler();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.bookKey !== prevState.bookKey) {
  //     this.setBooksHandler();
  //   }
  // }

  handleChange = (event, value) => {
    this.setState({ value: value });
  };

  setBooksHandler = () => {
    axios
      .get('https://anytime-library-cf928.firebaseio.com/books.json')
      .then(data => {
        if (data && data.data && Object.values(data.data).length) {
          this.setState({ books: data.data, openEdit: false, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  };

  getBooksHandler = isbn => {
    axios
      .get('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn)
      .then(res => {
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
        smallImage: bookInfo.imageLinks.smallThumbnail
          ? bookInfo.imageLinks.smallThumbnail
          : null,
        largeImage: bookInfo.imageLinks.thumbnail,
        ratingsCount: bookInfo.ratingsCount,
        isbn: bookInfo.industryIdentifiers[0].identifier,
        copies: 5,
        reviews: []
      };

      const title = obj.title;
      const books = { ...this.state.books };
      const existingBook = Object.values(books).find(
        boo => boo.title === title
      );
      if (existingBook) {
        this.setState({ open: true, message: 'This book already exists.' });
      } else {
        // books.push(obj);
        this.setState({ newBook: obj, loading: true });
        this.addBookHandler(this.state.newBook);
      }
    }
  };

  addNewBookHandler = () => {
    const book = {
      title: '',
      author: '',
      category: '',
      description: '',
      largeImage: 'https://www.classicposters.com/images/nopicture.gif',
      copies: ''
    };
    this.setState({ editedBook: book, openEdit: true, type: 'add' });
  };
  addBookHandler = book => {
    axios
      .post('https://anytime-library-cf928.firebaseio.com/books.json', book)
      .then(res => {
        this.setBooksHandler();
      });
  };

  closeHandler = close => {
    this.setState({ open: close, message: '' });
  };

  deleteBookHandler = key => {
    this.setState({ loading: true });
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
    this.setState({ editedBook: book, openEdit: true, type: 'edit' });
  };

  closePopupHandler = data => {
    this.setState({ openEdit: data });
  };

  updatedBookHandler = (book, type) => {
    if (type === 'edit') {
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
    } else if (type === 'add') {
      this.setState({ newBook: book, loading: true });
      this.addBookHandler(book);
    }
  };

  render() {
    const books = Object.values(this.props.store.books);
    const { value } = this.state;
    return (
      <div>
        {this.state.loading ? (
          <div className={classes.Loader}>
            <CircularProgress disableShrink />
          </div>
        ) : (
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
                type={this.state.type}
                handleChange={(data, type) =>
                  this.updatedBookHandler(data, type)
                }
                addIsbn={isbn => this.getBooksHandler(isbn)}
                closePopup={data => this.closePopupHandler(data)}
              />
            </Modal>

            {this.state.open ? (
              <SnackBar
                open={this.state.open}
                message={this.state.message}
                close={close => this.closeHandler(close)}
              />
            ) : null}

            <AppBar position="static" color="default">
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
                <Grid container justify="center" alignContent="space-around">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={this.addNewBookHandler}
                  >
                    Add Book
                  </Button>
                </Grid>
                <Grid container justify="center">
                  <Grid item xs={10}>
                    {/*         */}

                    <Library
                      delete={key => this.deleteBookHandler(key)}
                      editBook={book => this.editBookHandler(book)}
                    />
                  </Grid>
                </Grid>
              </div>
            )}
            {value === 1 && (
              <div>
                <Grid
                  container
                  spacing={16}
                  justify="center"
                  className={classes.IssuedBooks}
                >
                  {books.length ? (
                    books
                      .filter(bk => bk.issuedTo && bk.issuedTo.length)
                      .map(book => {
                        return (
                          <Grid
                            key={book.key}
                            item
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
                </Grid>
              </div>
            )}
          </div>
        )}
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
