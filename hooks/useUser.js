import { useEffect, useState } from 'react';
import firebase from '../utils/firebase';

export default function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  });

  return user;
}
