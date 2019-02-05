import React, { Component } from 'react';
import axios from 'axios';
import {
  Grid,
  TextField,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  List
} from '@material-ui/core';
import BookCard from './../BookCard/BookCard';
import { connect } from 'react-redux';
import classes from './Library.css';
import { ALL_BOOKS } from '../../store/actions';

class Library extends Component {
  constructor(params) {
    super(params);

    this.searchRef = React.createRef();
  }
  state = {
    intialBooks: [],
    filteredBooks: [],
    books: [],
    maxDays: 15,
    maxBooks: 5,
    categories: [],
    selectedCategories: []
  };
  componentWillMount() {
    this.setBooksHandler();
  }

  setBooksHandler = () => {
    axios
      .get('https://anytime-library-cf928.firebaseio.com/books.json')
      .then(data => {
        if (data && data.data) {
          this.parseData(data.data);
        }
      });
  };

  parseData = data => {
    const books = [];
    const categories = [];
    Object.keys(data).forEach(key => {
      const obj = { ...data[key], key: key };
      books.push(obj);
      if (obj.category && !categories.includes(obj.category.toUpperCase())) {
        categories.push(obj.category.toUpperCase());
      }
    });
    this.setState({
      intialBooks: books,
      books: books,
      filteredBooks: books,
      categories: categories
    });
    this.props.onAddAllBooks(books);
  };

  searchBookHandler = () => {
    const value = this.searchRef.current.value;
    const books = this.state.filteredBooks.filter(book => {
      return (
        book.title.toLowerCase().search(value.toLowerCase()) !== -1 ||
        book.author.toLowerCase().search(value.toLowerCase()) !== -1
      );
    });
    this.setState({ books: books });
  };

  filterToggle = category => {
    const selectedCategories = [...this.state.selectedCategories];
    if (!selectedCategories.includes(category.toUpperCase())) {
      selectedCategories.push(category.toUpperCase());
    } else {
      selectedCategories.splice(
        () =>
          selectedCategories.findIndex(
            cat => cat.category.toUpperCase() === category.toUpperCase()
          ),
        1
      );
    }
    const books = selectedCategories.length
      ? this.state.intialBooks.filter(book => {
          return selectedCategories.includes(book.category.toUpperCase());
        })
      : [...this.state.intialBooks];
    this.setState({
      filteredBooks: books,
      books: books,
      selectedCategories: selectedCategories
    });
    this.searchRef.current.value = null;
  };

  deleteBookHandler = key => {
    this.props.delete(key);
  };

  editBookHandler = book => {
    this.props.editBook(book);
  };

  render() {
    return (
      <div>
        <Grid container justify="center">
          <TextField
            id="standard-search"
            label="Search by Author or Title..."
            type="search"
            className={classes.textField}
            margin="normal"
            inputRef={this.searchRef}
            onChange={this.searchBookHandler}
          />
        </Grid>

        <Grid container spacing={16} className={classes.Books}>
          <Grid item xl={2}>
            <List dense className={classes.root}>
              {this.state.categories.map((category, i) => {
                return (
                  <Grid key={category} item>
                    <ListItem>
                      <ListItemText primary={category.toUpperCase()} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          onChange={() => this.filterToggle(category)}
                          // checked={this.state.checked.indexOf(value) !== -1}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Grid>
                );
              })}
            </List>
          </Grid>

          <Grid item xl={10}>
            <Grid container justify="center" spacing={16}>
              {this.state.books.length ? (
                this.state.books.map(book => {
                  return (
                    <Grid
                      key={book.key}
                      item
                      xl={2}
                      className={classes.BookCard}
                    >
                      <BookCard
                        // key={book.key}
                        delete={key => this.deleteBookHandler(key)}
                        book={book}
                        isAdmin={this.props.store.user.isAdmin}
                        editBook={book => this.editBookHandler(book)}
                      />
                    </Grid>
                  );
                })
              ) : (
                <div>
                  <h1>No Results</h1>
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
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
    onAddAllBooks: books => dispatch({ type: ALL_BOOKS, payload: books })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Library);
