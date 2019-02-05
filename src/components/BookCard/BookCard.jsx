import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography
} from '@material-ui/core';

import classes from './BookCard.css';
import { Link } from 'react-router-dom';

class BookCard extends Component {
  state = {};

  deleteBookHandler = isbn => {
    this.props.delete(isbn);
  };

  editBookHandler = book => {
    this.props.editBook(book);
  };
  render() {
    const { book } = this.props;
    return (
      <div>
        <Card className={classes.Card}>
          <Link to={'/book/' + book.key}>
            <CardActionArea>
              <CardMedia
                className={classes.Media}
                image={book.largeImage}
                // title={book.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  <div className={classes.Typography}>{book.title}</div>
                </Typography>
                <Typography component="p">
                  {/*{book.description} */}
                  Average Rating: {book.rating}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
          {this.props.isAdmin ? (
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => this.editBookHandler(book)}
              >
                Edit
              </Button>
              {book.issuedTo && book.issuedTo.length ? (
                <Button size="small" color="primary" disabled>
                  Issued
                </Button>
              ) : (
                <Button
                  size="small"
                  color="primary"
                  onClick={() => this.deleteBookHandler(book.key)}
                >
                  Delete
                </Button>
              )}
            </CardActions>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default BookCard;
