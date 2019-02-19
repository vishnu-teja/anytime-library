import React from 'react';
import { Grid, Button } from '@material-ui/core';
import classes from './Profile.css';
import BookCard from './../../BookCard/BookCard';

const Profile = props => {
  console.log(props);
  return (
    <div>
      <Grid
        container
        spacing={16}
        className={classes.Container}
        justify="center"
      >
        <Grid item xs={2}>
          <Grid container direction="column">
            <img
              className={classes.Image}
              src={props.user.image}
              alt={props.user.name}
            />
            <h3>Name: {props.user.name}</h3>
            <h4>Email: {props.user.email}</h4>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <div className={classes.Suggestions}>
            <p>
              <b>Suggestions: </b>
            </p>
            <Grid container alignItems="stretch" spacing={16}>
              {props.user.favoriteCategory ? (
                Object.values(props.books)
                  .filter(bk => bk.category === props.user.favoriteCategory)
                  .map((book, index) => {
                    if (index < 5) {
                      return (
                        <Grid key={book.isbn} item className={classes.BookCard}>
                          <BookCard book={book} isAdmin={props.user.isAdmin} />
                        </Grid>
                      );
                    }
                    return <div />;
                  })
              ) : (
                <Grid container direction="column" spacing={16}>
                  <p>
                    <h5>Please select a favorite cateogry: </h5>
                  </p>
                  <Grid container spacing={16}>
                    {props.books ? (
                      [
                        ...new Set([
                          ...Object.values(props.books).map(
                            name => name.category
                          )
                        ])
                      ].map(key => {
                        return (
                          <Grid key={key} item>
                            <Button
                              color="primary"
                              variant="outlined"
                              onClick={() => props.addFavorite(key)}
                            >
                              {' '}
                              {key}{' '}
                            </Button>
                          </Grid>
                        );
                      })
                    ) : (
                      <div />
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
            <br />
          </div>
          <p>
            <b>My Books: </b>
          </p>
          <Grid container alignItems="stretch" spacing={16}>
            {props.user.books.length ? (
              props.user.books.map(book => {
                return (
                  <Grid key={book.isbn} item className={classes.BookCard}>
                    <BookCard book={book} isAdmin={props.user.isAdmin} />
                    <p>
                      Issued On:{' '}
                      {new Date(book.issuedDate).toLocaleDateString('en-US')}
                    </p>
                  </Grid>
                );
              })
            ) : (
              <div>
                <h4>No Results</h4>
              </div>
            )}
          </Grid>
          <p>
            <b>History: </b>
          </p>
          <Grid container alignItems="stretch" spacing={16}>
            {props.user && props.user.history && props.user.history.length ? (
              props.user.history.map(book => {
                return (
                  <Grid key={Math.random()} item className={classes.BookCard}>
                    <BookCard book={book} isAdmin={props.user.isAdmin} />
                    <p>
                      Issued On:{' '}
                      {new Date(book.issuedDate).toLocaleDateString('en-US')}
                    </p>
                    <p>
                      Returned On:{' '}
                      {new Date(book.returnDate).toLocaleDateString('en-US')}
                    </p>
                  </Grid>
                );
              })
            ) : (
              <div>
                <h4>No Results</h4>
              </div>
            )}
          </Grid>
          <div />
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
