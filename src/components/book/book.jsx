import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Button, Avatar, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { ISSUE_BOOK, RETURN_BOOK } from '../../store/actions';
import SnackBar from './../snackbar/snackbar';
import { Link } from 'react-router-dom';
import { Rating } from 'material-ui-rating';
import * as routerTypes from './../../constants/routes';
import classes from './Book.css';
class Book extends Component {
  constructor(params) {
    super(params);
    this.textAreaRef = React.createRef();
  }
  state = {
    book: null,
    open: false,
    message: '',
    disableAddReview: false,
    addedReview: false,
    loading: true
  };
  componentDidMount() {
    const key = this.props.match.params.id;
    axios
      .get(
        'https://anytime-library-cf928.firebaseio.com/books/' + key + '.json'
      )
      .then(res => {
        if (res.data)
          this.setState({ book: { ...res.data, key: key }, loading: false });
      });
  }

  handleImage = () => {
    this.setState({
      book: {
        ...this.state.book,
        largeImage: 'https://www.classicposters.com/images/nopicture.gif'
      }
    });
  };

  issueBookHandler = () => {
    this.setState({ loading: true });
    const books = this.props.store.user.books
      ? [...this.props.store.user.books]
      : [];
    const copies = this.state.book.copies - 1;
    const issuedBook = {
      ...this.state.book,
      issuedDate: new Date()
    };
    books.push(issuedBook);
    const user = { ...this.props.store.user, books };
    this.updateUserHandler(user, 'issued');
    let book = { ...this.state.book, copies: copies };
    this.updateBooksHandler(book, 'issued');
  };

  returnBookHandler = () => {
    this.setState({ loading: true });
    const books = this.props.store.user.books
      ? [...this.props.store.user.books]
      : [];
    const copies = this.state.book.copies + 1;
    const issuedBook = books.find(bk => bk.key === this.state.book.key);
    const book = { ...issuedBook, returnDate: new Date(), copies: copies };
    books.splice(books.findIndex(indx => indx.key === issuedBook.key), 1);
    const history = this.props.store.user.history
      ? [...this.props.store.user.history]
      : [];

    history.push(book);

    const user = { ...this.props.store.user, books, history };
    this.updateUserHandler(user, 'returned');
    let removedBook = { ...this.state.book };
    removedBook.copies++;
    this.updateBooksHandler(removedBook, 'returned');
  };

  updateUserHandler = (user, action) => {
    axios
      .put(
        'https://anytime-library-cf928.firebaseio.com/users/' +
          user.key +
          '.json',
        user
      )
      .then(res => {
        this.props.onBookIssue(user);
        this.setState({
          open: true,
          message: action + ' successfully!',
          loading: false
        });
        sessionStorage.setItem('user', JSON.stringify(user));
      });
  };

  updateBooksHandler = (book, type) => {
    const key = this.props.match.params.id;
    const user = this.props.store.user;
    const issuedTo = book.issuedTo ? [...book.issuedTo] : [];
    const obj = {
      id: user.id,
      user: user.name,
      issuedOn: new Date(),
      image: user.image
    };
    if (type === 'issued') {
      issuedTo.push(obj);
    } else if (type === 'returned') {
      issuedTo.splice(issuedTo.findIndex(u => u.id === obj.id), 1);
    }
    const newBook = { ...book, issuedTo };
    axios
      .put(
        'https://anytime-library-cf928.firebaseio.com/books/' + key + '.json',
        newBook
      )
      .then(res => {});
  };

  closeHandler = close => {
    this.setState({ open: close, message: '' });
  };

  reviewAddHandler = () => {
    const obj = {
      id: this.props.store.user.id,
      user: this.props.store.user.name,
      image: this.props.store.user.image,
      review: this.textAreaRef.current.value
    };
    const reviews = this.state.book.reviews ? [...this.state.book.reviews] : [];
    reviews.push(obj);
    const book = { ...this.state.book, reviews };
    this.updateBooksHandler(book);
    this.setState({
      book: book,
      open: true,
      message: 'Review added successfully!'
    });
  };

  ratingHandler = value => {
    let rating = value;
    const currentBook = this.state.book;
    const user = this.props.store.user;
    if (currentBook.ratingsCount && currentBook.rating && user.ratings) {
      const userRating = user.ratings.find(b => b.key === currentBook.key);
      userRating
        ? (rating =
            (currentBook.rating * currentBook.ratingsCount -
              userRating.rating +
              value) /
            currentBook.ratingsCount)
        : (rating =
            (currentBook.rating * currentBook.ratingsCount + value) /
            (currentBook.ratingsCount + 1));
    }
    const book = { ...currentBook, rating: Math.round(rating) };
    this.updateBooksHandler(book);
    const obj = {
      key: book.key,
      bookName: book.title,
      rating: value
    };
    const ratings = [];
    ratings.push(obj);
    const newUser = { ...user, ratings };
    this.updateUserHandler(newUser, 'Rating added');
    this.setState({
      book: book
    });
  };

  render() {
    const { user } = this.props.store;
    const { book } = this.state;
    if (!book || !user) {
      return <div />;
    }

    const issuedBook =
      user.books && user.books.length
        ? user.books.find(bk => bk.key === book.key)
        : null;
    const issuedDate = issuedBook ? new Date(issuedBook.issuedDate) : null;
    const dueDate = issuedDate
      ? new Date(issuedDate.setDate(issuedDate.getDate() + 15))
      : null;
    const userRating =
      user.ratings && user.ratings.length
        ? user.ratings.find(b => b.key === book.key)
        : null;
    return (
      <div>
        {this.state.loading ? (
          <div className={classes.Loader}>
            <CircularProgress disableShrink />
          </div>
        ) : (
          <div>
            <div>
              <Link to={routerTypes.USER}>back</Link>
            </div>
            {book ? (
              <div>
                {this.state.open ? (
                  <SnackBar
                    open={this.state.open}
                    message={this.state.message}
                    close={close => this.closeHandler(close)}
                  />
                ) : null}
                <Grid
                  container
                  justify="center"
                  alignContent="space-around"
                  spacing={24}
                >
                  <Grid item>
                    <Grid container direction="column" justify="center">
                      <Grid item>
                        <img
                          src={book.largeImage}
                          alt={book.title}
                          onError={this.handleImage}
                          className={classes.Img}
                        />
                      </Grid>
                      {user.isAdmin ? (
                        book.issuedTo ? (
                          <div>
                            <h3>Issued to:</h3>
                            <ul>
                              {book.issuedTo.map(u => (
                                <li key={Math.random()}>{u.user}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div />
                        )
                      ) : issuedBook ? (
                        <div>
                          <p>Due Date: {dueDate.toLocaleDateString('en-US')}</p>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.returnBookHandler}
                          >
                            Return
                          </Button>
                        </div>
                      ) : (
                        <div>
                          {user.books && user.books.length >= 5 ? (
                            'Cannot take more than 5 books.'
                          ) : book.copies ? (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={this.issueBookHandler}
                            >
                              Issue
                            </Button>
                          ) : (
                            'Out of stock.'
                          )}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item>
                        <h1>{book.title}</h1>
                        <h3>Avg. Rating: {book.rating}</h3>{' '}
                        {user.isAdmin ? (
                          <div />
                        ) : (
                          <Rating
                            value={userRating ? userRating.rating : 0}
                            max={5}
                            onChange={value => this.ratingHandler(value)}
                          />
                        )}
                        <p className={classes.WrapContent}>
                          <b>Description:</b> {book.description}
                        </p>
                        {book.reviews &&
                        book.reviews.find(b => b.id === user.id) ? (
                          <div />
                        ) : (
                          <Grid container direction="column" spacing={16}>
                            {user.isAdmin ? (
                              <div />
                            ) : (
                              <div>
                                <Grid item>
                                  <p>
                                    <b>Add a review:</b>{' '}
                                  </p>

                                  <textarea
                                    ref={this.textAreaRef}
                                    // cols="100"
                                    // rows="5"
                                    onChange={this.enableAddButton}
                                    className={classes.TextArea}
                                  />
                                </Grid>
                                <Grid item>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.reviewAddHandler}
                                  >
                                    Add
                                  </Button>
                                </Grid>
                              </div>
                            )}
                          </Grid>
                        )}
                        <Grid container justify="flex-start">
                          <Grid item>
                            <h3>Reviews: </h3>
                            {book.reviews ? (
                              book.reviews.map(review => {
                                return (
                                  <Grid
                                    container
                                    alignContent="space-around"
                                    spacing={16}
                                    key={review.user}
                                  >
                                    <Grid item>
                                      <Avatar
                                        className={classes.UserIcon}
                                        src={review.image}
                                      />
                                    </Grid>
                                    <Grid item xs={8}>
                                      <h4>{review.user}</h4>
                                      <p>{review.review}</p>
                                    </Grid>
                                  </Grid>
                                );
                              })
                            ) : (
                              <div />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            ) : null}
          </div>
        )}
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
    onBookIssue: user => dispatch({ type: ISSUE_BOOK, payload: user }),
    onBookReturn: user => dispatch({ type: RETURN_BOOK, payload: user })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);
