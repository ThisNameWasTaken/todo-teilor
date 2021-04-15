import dynamic from 'next/dynamic';
import Router from 'next/router';
import { Add } from '@material-ui/icons';

import ExtendedFAB from '../components/ExtendedFAB';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar/TabBar';
import SkeletonToDoList from '../components/ToDoList/SkeletonToDoList';
import useToDos from '../hooks/useToDos';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';

const ToDoList = dynamic(() => import('../components/ToDoList/ToDoList'), {
  loading: SkeletonToDoList,
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 1330,
    width: '100%',
    margin: 'auto',
  },
}));

export default function ToDos() {
  const classes = useStyles();
  const activeTodos = useToDos('active');
  const completedTodos = useToDos('completed');
  const [todoList, setTodoList] = useState(activeTodos);
  const [tab, setTab] = useState('active');

  function onTabChange(value) {
    setTab(value);
  }

  useEffect(() => {
    if (tab === 'active') {
      return setTodoList(activeTodos);
    }

    if (tab === 'completed') {
      return setTodoList(completedTodos);
    }
  }, [tab, activeTodos, completedTodos]);

  return (
    <div style={{ paddingTop: 72 + 48 }}>
      <NavBar />
      <TabBar onTabChange={onTabChange} />
      <main className={classes.container}>
        {!todoList ? <SkeletonToDoList /> : <ToDoList items={todoList} />}
      </main>
      <ExtendedFAB
        icon={<Add />}
        label="Add To Do"
        onClick={() => {
          Router.push('/add-todo');
        }}
      />
    </div>
  );
}
