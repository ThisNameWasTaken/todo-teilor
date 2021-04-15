import Router, { useRouter } from 'next/router';
import {
  makeStyles,
  Button,
  Container,
  Grid,
  TextField,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';

import BackButton from '../components/BackButton';
import firebase from '../utils/firebase';
import useUser from '../hooks/useUser';
import { useEffect, useState } from 'react';

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
    margin: theme.spacing(0, 0, 2, 0),
  },
  button: {
    width: '100%',
    padding: theme.spacing(1.7, 2.7),
  },
}));

function getNowTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
}

function getNowDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return `${now.getFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
}

export default function AddToDo() {
  const router = useRouter();
  const query = router.query;

  const buttonText = query.edit ? 'edit to do' : 'add to do';

  const classes = useStyles();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      'due time': query.dueTime || `${getNowDate()}T${getNowTime()}`,
      title: query.title || '',
    },
  });
  const user = useUser();

  async function addToDo(params) {
    console.log('add to do');
    console.log({ params });

    console.log({ query });

    try {
      const docPath = firebase
        .firestore()
        .collection('users')
        .doc(user.uid)
        .collection('todos');

      if (!query.edit) {
        await docPath.add({
          title: params.title,
          dueTime: params['due time'],
          status: 'active',
        });
      } else {
        // @ts-ignore
        await docPath.doc(query.edit).update({
          title: params.title,
          dueTime: params['due time'],
        });
      }

      Router.back();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <AppBar position="fixed" color="transparent" elevation={0}>
        <Toolbar>
          <BackButton />
        </Toolbar>
      </AppBar>
      <main>
        <form onSubmit={handleSubmit(addToDo)}>
          <Container className={classes.container}>
            <Grid container direction="column">
              <Grid item>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  label="Title"
                  name="title"
                  type="title"
                  error={errors.title}
                  helperText={errors?.title?.message}
                  inputProps={{
                    ...register('title', { required: 'Please add a title' }),
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  className={classes.textField}
                  variant="outlined"
                  label="Due time"
                  name="due time"
                  type="datetime-local"
                  error={errors['due time']}
                  helperText={errors?.['due time']?.message}
                  inputProps={{
                    ...register('due time', {
                      required: 'Please select a due time',
                    }),
                  }}
                />
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs>
                    <Button
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      type="submit"
                    >
                      {buttonText}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </form>
      </main>
    </>
  );
}
