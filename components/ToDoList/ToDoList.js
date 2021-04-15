import { useState } from 'react';
import Router from 'next/router';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Delete, Done, Edit, MoreVert } from '@material-ui/icons';
import { List as VirtualizedList, WindowScroller } from 'react-virtualized';
import useUser from '../../hooks/useUser';
import firebase from '../../utils/firebase';

const useToDoListStyles = makeStyles((theme) => ({
  list: {
    paddingBottom: 72,

    '&:focus, & > *:focus': {
      outline: 'none',
    },
  },
  listItemText: {
    marginRight: theme.spacing(4),
  },
  nothingToDo: {
    opacity: 0.8,
    height: 'calc(var(--vh, 1vh) * 100 - 72px - 48px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
}));

/**
 *
 * @param {{
 *  items: { title: string, dueTime: string, id:string, status: 'active' | 'completed' }[]
 * }} props
 * @returns
 */
export default function ToDoList({ items }) {
  const classes = useToDoListStyles();
  const user = useUser();

  function getToDoPath(item) {
    return firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('todos')
      .doc(item.id);
  }

  function removeToDo(item) {
    console.log('removing', { item });
    return getToDoPath(item).delete();
  }

  function completeToDo(item) {
    console.log('completing', { item });
    return getToDoPath(item).update({
      status: 'completed',
    });
  }

  function editToDo(item) {
    Router.push(
      `/add-todo?edit=${item.id}&title=${item.title}&dueTime=${item.dueTime}`
    );
  }

  function rowRenderer({ key, index, style }) {
    const item = items[index];

    return (
      <div key={key} style={style}>
        <ListItem style={{ position: 'relative' }}>
          <ListItemText
            className={classes.listItemText}
            primary={<Typography noWrap>{item.title}</Typography>}
            secondary={
              <Typography noWrap>
                {item.dueTime.split('T')[0]} {item.dueTime.split('T')[1]}
              </Typography>
            }
          />
          {item.status === 'active' && (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="done"
                color="secondary"
                onClick={() => completeToDo(item)}
              >
                <Done />
              </IconButton>
              <MoreOptions
                item={item}
                onRemove={() => removeToDo(item)}
                onEdit={() => editToDo(item)}
              />
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </div>
    );
  }

  return items.length === 0 ? (
    <div className={classes.nothingToDo}>
      <Typography variant="h4">You have nothing to do ¯\_(ツ)_/¯</Typography>
    </div>
  ) : (
    <List className={classes.list}>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop, width }) => (
          <VirtualizedList
            width={width}
            autoWidth
            autoHeight
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            scrollTop={scrollTop}
            height={height}
            rowHeight={72}
            rowRenderer={rowRenderer}
            rowCount={items.length}
          />
        )}
      </WindowScroller>
    </List>
  );
}

const useMoreOptionsStyles = makeStyles((theme) => ({
  menuIcon: {
    marginRight: theme.spacing(1),
  },
  menuItemDanger: {
    color: theme.palette.error.main,
  },
  menuItem: {
    color: theme.palette.primary.main,
  },
}));

function MoreOptions({
  item,
  onOpen = () => {},
  onClose = () => {},
  onEdit = () => {},
  onRemove = () => {},
}) {
  const classes = useMoreOptionsStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  function openMenu(event) {
    onOpen();
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    onClose();
    setAnchorEl(null);
  }

  function edit() {
    onEdit();
    closeMenu();
  }

  function remove() {
    onRemove();
    closeMenu();
  }

  return (
    <>
      <IconButton
        edge="end"
        aria-label="more options"
        aria-controls={`options-menu-${item.id}`}
        aria-haspopup="true"
        onClick={openMenu}
      >
        <MoreVert />
      </IconButton>

      <Menu
        id={`options-menu-${item.id}`}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={edit} className={classes.menuItem}>
          <Edit className={classes.menuIcon} />
          Edit
        </MenuItem>
        <MenuItem onClick={remove} className={classes.menuItemDanger}>
          <Delete className={classes.menuIcon} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
