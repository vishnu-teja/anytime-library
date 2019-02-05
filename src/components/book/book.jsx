import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Button, Avatar } from '@material-ui/core';
import { connect } from 'react-redux';
import { ISSUE_BOOK, RETURN_BOOK } from '../../store/actions';
import SnackBar from './../snackbar/snackbar';
import { Link } from 'react-router-dom';
import { Rating } from 'material-ui-rating';
import * as routerTypes from './../../constants/routes';
// import classes from './Book.css';
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
    addedReview: false
  };
  componentDidMount() {
    const key = this.props.match.params.id;
    axios
      .get(
        'https://anytime-library-cf928.firebaseio.com/books/' + key + '.json'
      )
      .then(res => {
        console.log(res);
        if (res.data) this.setState({ book: res.data });
      });
  }

  issueBookHandler = () => {
    const books = this.props.store.user.books
      ? [...this.props.store.user.books]
      : [];
    const issuedBook = { ...this.state.book, issuedDate: new Date() };
    books.push(issuedBook);
    const user = { ...this.props.store.user, books };
    this.updateUserHandler(user, 'issued');
    let book = { ...this.state.book };
    book.copies--;
    this.updateBooksHandler(book);
  };

  returnBookHandler = () => {
    const books = this.props.store.user.books
      ? [...this.props.store.user.books]
      : [];
    const issuedBook = books.find(bk => bk.isbn === this.state.book.isbn);
    const book = { ...issuedBook, returnDate: new Date() };
    books.splice(bk => {
      return books.findIndex(indx => indx.isbn === issuedBook.isbn);
    }, 1);
    const history = this.props.store.user.history
      ? [...this.props.store.user.history]
      : [];

    history.push(book);

    const user = { ...this.props.store.user, books, history };
    console.log(user);
    this.updateUserHandler(user, 'returned');
    let removedBook = { ...this.state.book };
    removedBook.copies++;
    this.updateBooksHandler(removedBook);
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
        console.log(res);
        this.props.onBookIssue(user);
        this.setState({ open: true, message: action + ' successfully!' });
        sessionStorage.setItem('user', JSON.stringify(user));
      });
  };

  updateBooksHandler = book => {
    const key = this.props.match.params.id;
    const user = this.props.store.user;
    const issuedTo = book.issuedTo ? [...book.issuedTo] : [];
    const obj = {
      user: user.name,
      issuedOn: new Date(),
      image: user.image
    };
    issuedTo.push(obj);
    const newBook = { ...book, issuedTo };
    axios
      .put(
        'https://anytime-library-cf928.firebaseio.com/books/' + key + '.json',
        newBook
      )
      .then(res => {
        console.log(res);
      });
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
      const userRating = user.ratings.find(b => b.isbn === currentBook.isbn);
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
      isbn: book.isbn,
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
      user.books && user.books.length && book
        ? user.books.find(bk => bk.isbn === book.isbn)
        : null;
    const issuedDate = issuedBook ? new Date(issuedBook.issuedDate) : null;
    const dueDate = issuedDate
      ? new Date(issuedDate.setDate(issuedDate.getDate() + 15))
      : null;
    const userRating =
      user.ratings && user.ratings.length
        ? user.ratings.find(b => b.isbn === book.isbn)
        : null;
    console.log(book, user);
    return (
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
            <Grid container spacing={24} justify="center">
              <Grid item xl={4}>
                <div>
                  <img src={book.largeImage} alt={book.title} />
                  {issuedBook ? (
                    <div>
                      <p>Due Date: {dueDate.toLocaleDateString('en-US')}</p>
                      <Button onClick={this.returnBookHandler}>Return</Button>
                    </div>
                  ) : (
                    <Button onClick={this.issueBookHandler}>Issue</Button>
                  )}
                </div>
              </Grid>
              <Grid item xl={6}>
                <h1>{book.title}</h1>
                <h3>Rating:{book.rating}</h3>{' '}
                <Rating
                  value={userRating ? userRating.rating : 0}
                  max={5}
                  onChange={value => this.ratingHandler(value)}
                />
                <p>Description: {book.description}</p>
                {book.reviews && book.reviews.find(b => b.id === user.id) ? (
                  <div />
                ) : (
                  <div>
                    <p>Add a review: </p>

                    <textarea
                      ref={this.textAreaRef}
                      cols="30"
                      rows="10"
                      onChange={this.enableAddButton}
                    />
                    <button onClick={this.reviewAddHandler}>Add</button>
                  </div>
                )}
              </Grid>

              <p>Reviews: </p>
              {book.reviews ? (
                book.reviews.map(review => {
                  return (
                    <div key={review.user}>
                      <Avatar src={review.image} />
                      <h4>{review.user}</h4>
                      <br />
                      <p>{review.review}</p>
                    </div>
                  );
                })
              ) : (
                <div />
              )}
            </Grid>
          </div>
        ) : null}
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
