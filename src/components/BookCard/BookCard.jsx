import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid
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
              <Grid container spacing={16} justify="center">
                <Grid item>
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => this.editBookHandler(book)}
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  {book.issuedTo && book.issuedTo.length ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      disabled
                    >
                      Issued
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => this.deleteBookHandler(book.key)}
                    >
                      Delete
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardActions>
          ) : null}
        </Card>
      </div>
    );
  }
}

export default BookCard;
