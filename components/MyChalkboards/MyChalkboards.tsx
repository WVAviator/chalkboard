import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import React from 'react';
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
                    secondary={`Last modified: ${chalkboard.lastModified}`}
                  />
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
