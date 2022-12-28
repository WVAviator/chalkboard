import {
  Avatar,
  CircularProgress,
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
import { useModalStore } from '../../hooks/useModalStore';

interface ChalkboardFile {
  id: string;
  title: string;
  lastModified: Date;
}

interface MyChalkboardsProps {
  onSelected: (id: string) => void;
}

const MyChalkboards: React.FC<MyChalkboardsProps> = ({ onSelected }) => {
  const [chalkboards, setChalkboards] = React.useState<ChalkboardFile[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { open, close } = useModalStore((state) => ({
    open: state.myChalkboardsModalOpen,
    close: state.closeMyChalkboardsModal,
  }));

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    const getChalkboards = async () => {
      const response = await fetch('/api/canvas');
      const { data } = await response.json();
      setChalkboards(data || []);
      setLoading(false);
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

  const chalkboardsList = chalkboards.length ? (
    chalkboards.map((chalkboard) => {
      return (
        <ListItem
          key={chalkboard.id}
          className={styles.listItem}
          onClick={() => {
            close();
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
  );

  // TODO: This would look cooler as a Skeleton loader
  const loadingList = (
    <div className={styles.loading}>
      <CircularProgress />
    </div>
  );

  return (
    <Dialog open={open} scroll="paper" onClose={close}>
      <DialogTitle>My Chalkboards</DialogTitle>
      <DialogContent dividers>
        <List>{loading ? loadingList : chalkboardsList}</List>
      </DialogContent>
    </Dialog>
  );
};

export default MyChalkboards;
