import dynamic from 'next/dynamic';
import Router from 'next/router';
import { Add } from '@material-ui/icons';

import ExtendedFAB from '../components/ExtendedFAB';
import NavBar from '../components/NavBar';
import TabBar from '../components/TabBar/TabBar';
import SkeletonToDoList from '../components/ToDoList/SkeletonToDoList';

const ToDoList = dynamic(() => import('../components/ToDoList/ToDoList'), {
  loading: SkeletonToDoList,
  ssr: false,
});

export default function ToDos() {
  const todoList = [
    {
      title:
        'Lorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum Lorem ipsumLorem ipsumLorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '1',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '2',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '3',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '4',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '5',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '6',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '7',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '4',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '5',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '6',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '7',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '4',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '5',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '6',
    },
    {
      title: 'Lorem ipsum',
      dueTime: 'Due in 2 hours',
      id: '7',
    },
  ];

  return (
    <div style={{ paddingTop: 72 + 48 }}>
      <NavBar />
      <TabBar />
      <ToDoList items={todoList} />
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
