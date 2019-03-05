import React, { Component } from 'react';
import { Grid, TextField, Button, Input } from '@material-ui/core';
import classes from './EditBook.css';
import SnackBar from './../../snackbar/snackbar';

class EditBook extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    this.state = { book: { ...props.book }, open: false, message: '' };
  }

  updateBook = event => {
    let value = event.target.value;
    if (event.target.id === 'copies' && event.target.value !== '')
      value = Number(event.target.value);
    this.setState({
      book: {
        ...this.state.book,
        [event.target.id]: value
      }
    });
  };

  handleChange = (book, type) => {
    const noValue = Object.values(book).findIndex(b => b === '');
    if (noValue >= 0) {
      this.setState({ open: true, message: 'Please fill all the details.' });
    } else {
      this.props.handleChange(book, type);
    }
  };

  closeHandler = close => {
    this.setState({ open: close, message: '' });
  };

  render() {
    const { book } = this.state;
    return (
      <div>
        {this.state.open ? (
          <SnackBar
            open={this.state.open}
            message={this.state.message}
            close={close => this.closeHandler(close)}
          />
        ) : null}
        <Grid container justify="center" className={classes.Modal}>
          <form className={classes.container} noValidate autoComplete="off">
            <Grid container justify="center" spacing={16}>
              <Grid item>
                <img
                  src={book.largeImage}
                  alt={book.title}
                  className={classes.BookImage}
                />
              </Grid>
              <Grid item>
                <Grid container direction="column">
                  <TextField
                    required
                    id="title"
                    label="Title"
                    className={classes.textField}
                    value={book.title}
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.updateBook(e)}
                  />

                  <TextField
                    required
                    id="author"
                    label="Author"
                    className={classes.textField}
                    value={book.author}
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.updateBook(e)}
                  />

                  <TextField
                    required
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
              </Grid>
              <Grid item>
                <Grid container direction="column">
                  <TextField
                    required
                    id="category"
                    label="Category"
                    className={classes.textField}
                    value={book.category}
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.updateBook(e)}
                  />
                  <TextField
                    required
                    id="copies"
                    label="Copies"
                    className={classes.textField}
                    value={book.copies}
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.updateBook(e)}
                  />
                  <TextField
                    required
                    id="largeImage"
                    label="Image link"
                    className={classes.textField}
                    value={book.largeImage}
                    margin="normal"
                    variant="outlined"
                    onChange={e => this.updateBook(e)}
                  />
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => this.handleChange(book, this.props.type)}
                  >
                    {' '}
                    {this.props.type === 'edit' ? 'Update' : 'Add'}{' '}
                  </Button>
                </Grid>
              </Grid>
              {this.props.type === 'add' ? (
                <Grid item className={classes.AddNew}>
                  <p>or</p>
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
                    onClick={() =>
                      this.props.addIsbn(this.inputRef.current.value)
                    }
                    color="primary"
                  >
                    Add Book
                  </Button>
                </Grid>
              ) : (
                <div />
              )}
            </Grid>
          </form>
        </Grid>
        <Button onClick={() => this.props.closePopup(false)}> X </Button>
      </div>
    );
  }
}

export default EditBook;
