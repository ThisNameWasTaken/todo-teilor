import { IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';

import firebase from '../../utils/firebase';
import SignOutIcon from './SignOutIcon';
import { useStyles } from './styles';

const SignOutButton = (props) => {
  const classes = useStyles();
  const router = useRouter();

  async function signOut() {
    const auth = await firebase.auth();

    auth.signOut();
    router.push('/sign-in');
  }

  return (
    <IconButton
      aria-label="sign out"
      color="inherit"
      onClick={signOut}
      {...props}
    >
      <SignOutIcon className={classes.icon} />
    </IconButton>
  );
};

export default SignOutButton;
