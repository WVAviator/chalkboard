import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { MouseEvent } from 'react';
import styles from './MyChalkboards.module.css';

interface ChalkboardFile {
  id: string;
  title: string;
  lastModified: Date;
}

interface MyChalkboardsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelected: (id: string) => void;
}

const MyChalkboards: React.FC<MyChalkboardsProps> = ({
  open,
  setOpen,
  onSelected,
}) => {
  const [chalkboards, setChalkboards] = React.useState<ChalkboardFile[]>([]);

  React.useEffect(() => {
    const getChalkboards = async () => {
      const response = await fetch('/api/canvas');
      const { success, data } = await response.json();
      setChalkboards(data || []);
    };
    getChalkboards();
  }, [open]);

  const handleDelete = async (event: MouseEvent, id: string) => {
    event.stopPropagation();
    const response = await fetch(`/api/canvas/${id}`, {
      method: 'DELETE',
    });
    const { success } = await response.json();
    if (success) {
      setChalkboards((chalkboards) =>
        chalkboards.filter((chalkboard) => chalkboard.id !== id)
      );
    } else {
      console.log('Error deleting chalkboard');
    }
  };

  return (
    <Dialog open={open} scroll="paper" onClose={() => setOpen(false)}>
      <DialogTitle>My Chalkboards</DialogTitle>
      <DialogContent dividers>
        <List>
          {chalkboards.length ? (
            chalkboards.map((chalkboard) => {
              return (
                <ListItem
                  key={chalkboard.id}
                  className={styles.listItem}
                  onClick={() => {
                    setOpen(false);
                    onSelected(chalkboard.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <NoteAltIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chalkboard.title}
                    secondary={`Last modified: ${new Date(
                      chalkboard.lastModified
                    ).toLocaleDateString()}`}
                  />
                  <IconButton
                    size="small"
                    aria-label="delete"
                    onClick={(event) => handleDelete(event, chalkboard.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              );
            })
          ) : (
            <DialogContentText>You have no chalkboards yet.</DialogContentText>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default MyChalkboards;
