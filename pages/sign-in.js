import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import {
  makeStyles,
  Button,
  Container,
  Divider,
  Fab,
  Grid,
  InputAdornment,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useForm } from 'react-hook-form';

import Facebook from '../components/icons/facebook';
import Google from '../components/icons/google';
import Twitter from '../components/icons/twitter';
import firebase from '../utils/firebase';

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    height: 'calc(var(--vh, 1vh) * 100)',
  },
  textField: {
    width: '100%',
    margin: theme.spacing(1, 0),
  },
  button: {
    width: '100%',
    // 12 22
    padding: theme.spacing(1.7, 2.7),
  },
  fabGoogle: {
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: '#ebebeb',
    },
  },
  fabTwitter: {
    color: theme.palette.common.white,
    backgroundColor: '#1a91da',
    '&:hover': {
      backgroundColor: '#1579B7',
    },
  },
  fabFacebook: {
    color: theme.palette.common.white,
    backgroundColor: '#4267b2',
    '&:hover': {
      backgroundColor: '#375695',
    },
  },
  signInText: {
    padding: theme.spacing(1),
    color: 'rgba(0, 0, 0, .55)',
  },
  fabIcon: {
    width: 24,
    height: 'auto',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((isVisible) => !isVisible);
  }

  const [firebaseError, setFirebaseError] = useState(null);

  /**
   * @param {{ email: string, password: string }} param
   */
  async function signIn({ email, password }) {
    setFirebaseError(null);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);

      Router.push('/todos');
    } catch (err) {
      setFirebaseError(err.message);
      console.error(err);
    }
  }

  async function signInWithGoogle() {
    try {
      await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());

      Router.push('/todos');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit(signIn)}>
        <Container className={classes.container}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Grid
                className={classes.signInText}
                container
                spacing={2}
                justify="center"
                alignContent="center"
              >
                <Grid item>
                  <Typography variant="subtitle1">Sign in with</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justify="space-around">
                <Grid item>
                  <Tooltip
                    title="Sign in with Google"
                    aria-label="Sign in with Google"
                  >
                    <Fab
                      className={classes.fabGoogle}
                      onClick={signInWithGoogle}
                    >
                      <Google className={classes.fabIcon} />
                    </Fab>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip
                    title="Sign in with Facebook"
                    aria-label="Sign in with Facebook"
                  >
                    <Fab className={classes.fabFacebook}>
                      <Facebook className={classes.fabIcon} />
                    </Fab>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip
                    title="Sign in with Twitter"
                    aria-label="Sign in with Twitter"
                  >
                    <Fab className={classes.fabTwitter}>
                      <Twitter className={classes.fabIcon} />
                    </Fab>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                className={classes.signInText}
                container
                spacing={2}
                justify="center"
                alignContent="center"
              >
                <Grid className={classes.dividerContainer} item xs>
                  <Divider className={classes.divider} />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    Or the old fashion way
                  </Typography>
                </Grid>
                <Grid className={classes.dividerContainer} item xs>
                  <Divider className={classes.divider} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                className={classes.textField}
                variant="outlined"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                error={errors.email}
                helperText={errors?.email?.message}
                inputProps={{
                  ...register('email', { required: 'Email is required' }),
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                className={classes.textField}
                variant="outlined"
                label="Password"
                name="password"
                autoComplete="current-password"
                type={isPasswordVisible ? 'text' : 'password'}
                error={errors.password}
                helperText={errors?.password?.message}
                InputProps={{
                  ...register('password', { required: 'Password is required' }),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Show password">
                        <IconButton
                          aria-label="Show password"
                          aria-pressed={isPasswordVisible}
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {firebaseError && (
              <Grid item>
                <Typography color="error">{firebaseError}</Typography>
              </Grid>
            )}
            <Grid item>
              <Grid container direction="row" spacing={3}>
                <Grid item xs>
                  <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    sign in
                  </Button>
                </Grid>
                <Grid item xs>
                  <Link href="/sign-up">
                    <Button
                      className={classes.button}
                      component="a"
                      color="secondary"
                      variant="contained"
                      type="submit"
                    >
                      sign up
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </form>
    </main>
  );
}
