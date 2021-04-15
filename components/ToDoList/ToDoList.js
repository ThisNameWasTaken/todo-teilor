import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Delete, Done, Edit, MoreVert, Save, Close } from '@material-ui/icons';
import { List as VirtualizedList, WindowScroller } from 'react-virtualized';

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
}));

/**
 *
 * @param {{
 *  items: { title: string, dueTime: string, id:string }[]
 * }} props
 * @returns
 */
export default function ToDoList({ items }) {
  const classes = useToDoListStyles();

  function rowRenderer({ key, index, style }) {
    const item = items[index];

    return (
      <div key={key} style={style}>
        <ListItem style={{ position: 'relative' }}>
          <ListItemText
            className={classes.listItemText}
            primary={<Typography noWrap>{item.title}</Typography>}
            secondary={<Typography noWrap>{item.dueTime}</Typography>}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="done" color="secondary">
              <Done />
            </IconButton>
            <MoreOptions item={item} />
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    );
  }

  return (
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
        <MenuItem onClick={edit}>
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
