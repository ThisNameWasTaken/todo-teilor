import { AppBar, Toolbar, List, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import useScrollDirection from '../../hooks/useScrollDirection';
import SignOutButton from '../SignOutButton';
import UserInfo from '../UserInfo';
import useUser from '../../hooks/useUser';

const useStyles = makeStyles((theme) => ({
  actionsDivider: {
    marginRight: 'auto',
  },
  navBar: {
    willChange: 'transform',
    transform: 'translateY(0)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.short,
    }),
  },
  navBarHidden: {
    transform: 'translateY(-100%)',
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const scrollDirection = useScrollDirection();

  const user = useUser();

  return (
    <AppBar
      position="fixed"
      className={clsx(
        classes.navBar,
        scrollDirection === 'down' && classes.navBarHidden
      )}
    >
      <Toolbar variant="dense">
        <List>
          <UserInfo user={user} />
        </List>
        <div className={classes.actionsDivider} />
        <SignOutButton />
      </Toolbar>
    </AppBar>
  );
}
