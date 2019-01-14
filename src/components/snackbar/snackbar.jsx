import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
class SnackBar extends Component {
  state = {
    open: false
  };

  componentDidMount() {
    this.setState({ open: this.props.open });
  }

  closeHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ open: false });
    this.props.close(false);
  };
  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={this.state.open}
        autoHideDuration={5000}
        onClose={this.closeHandler}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{this.props.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.closeHandler}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default SnackBar;
