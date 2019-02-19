import React, { Component } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import classes from './EditBook.css';

class EditBook extends Component {
  constructor(props) {
    super(props);

    this.state = { book: { ...props.book } };
  }

  updateBook = event => {
    let value = event.target.value;
    if (event.target.id === 'copies') value = Number(event.target.value);
    this.setState({
      book: {
        ...this.state.book,
        [event.target.id]: value
      }
    });
  };

  render() {
    const { book } = this.state;
    console.log(book);
    return (
      <div>
        <Grid container justify="center" className={classes.Modal}>
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container justify="center">
              <Grid item xs={3}>
                <TextField
                  id="title"
                  label="Title"
                  className={classes.textField}
                  value={book.title}
                  margin="normal"
                  variant="outlined"
                  onChange={e => this.updateBook(e)}
                />
                <TextField
                  id="author"
                  label="Author"
                  className={classes.textField}
                  value={book.author}
                  margin="normal"
                  variant="outlined"
                  onChange={e => this.updateBook(e)}
                />

                <TextField
                  id="description"
                  label="Description"
                  multiline
                  rowsMax="4"
                  className={classes.textField}
                  value={book.description}
                  margin="normal"
                  variant="outlined"
                  onChange={e => this.updateBook(e)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="category"
                  label="Category"
                  className={classes.textField}
                  value={book.category}
                  margin="normal"
                  variant="outlined"
                  onChange={e => this.updateBook(e)}
                />
                <TextField
                  id="copies"
                  label="Copies"
                  className={classes.textField}
                  value={book.copies}
                  margin="normal"
                  variant="outlined"
                  onChange={e => this.updateBook(e)}
                />
                <Button
                  color="primary"
                  onClick={() => this.props.handleChange(book)}
                >
                  {' '}
                  Update{' '}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Button onClick={() => this.props.closePopup(false)}> X </Button>
      </div>
    );
  }
}

export default EditBook;
