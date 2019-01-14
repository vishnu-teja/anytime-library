import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import classes from './book.css';

class Book extends Component {
  state = {};

  deleteBookHandler = isbn => {
    this.props.delete(isbn);
  };
  render() {
    console.log(this.props.book);

    return (
      <div>
        <Card className={classes.Card}>
          <CardActionArea>
            <CardMedia
              className={classes.Media}
              image={this.props.book.largeImage}
              title={this.props.book.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {this.props.book.title}
              </Typography>
              <Typography component="p">
                {this.props.book.description}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary">
              Edit
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => this.deleteBookHandler(this.props.book.isbn)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default Book;
