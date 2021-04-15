import { useEffect, useState } from 'react';
import firebase from '../utils/firebase';
import useUser from './useUser';

/**
 *
 * @param {'active' | 'completed'} status
 * @returns
 */
export default function useToDos(status) {
  const [toDos, setToDos] = useState();
  const user = useUser();

  console.log('use todos');

  useEffect(() => {
    console.log({ user });
    if (!user) return;

    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('todos')
      .where('status', '==', status)
      .onSnapshot((querySnapshot) => {
        let toDos = [];
        querySnapshot.forEach((doc) => {
          const toDo = doc.data();
          toDo.id = doc.id;
          toDos.push(toDo);
        });
        console.log({ toDos });
        // @ts-ignore
        setToDos(toDos);
      });
  }, [user]);

  return toDos;
}
