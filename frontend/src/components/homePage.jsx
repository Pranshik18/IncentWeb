import React from 'react';
import { Button, Container, makeStyles } from '@material-ui/core';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url("https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?cs=srgb&dl=pexels-codioful-%28formerly-gradienta%29-7130560.jpg&fm=jpg")',
    backgroundSize: 'cover',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
      margin: theme.spacing(10),
    padding: theme.spacing(2),
    borderRadius: '20px',
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)" 
  },
}));

const HomePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth='sm'>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          href="/admin/logIn"
        >
          Admin Side
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          href="/user/logIn"
        >
          User Side
        </Button>
      </Container>
    </div>
  );
};

export default HomePage;
