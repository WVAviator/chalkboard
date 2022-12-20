import { Button, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import styles from './TitleDisplay.module.css';
import EditIcon from '@mui/icons-material/Edit';
import styled from '@emotion/styled';

interface TitleDisplayProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

const TitleDisplay: React.FC<TitleDisplayProps> = ({ title, setTitle }) => {
  const [editing, setEditing] = React.useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleToggleEdit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleToggleEdit}>
        <Button onClick={handleToggleEdit}>
          <EditIcon color="secondary" fontSize="small" />
        </Button>
        <TextField
          id="title"
          variant="standard"
          onChange={handleChange}
          value={title}
          color="secondary"
          disabled={!editing}
          sx={{
            input: {
              color: 'secondary.main',
            },

            '& .MuiInput-underline:before': {
              borderBottomColor: editing ? 'secondary.main' : 'transparent',
              color: 'secondary.main',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: editing ? 'secondary.main' : 'transparent',
              color: 'secondary.main',
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
              borderBottomColor: editing ? 'secondary.main' : 'transparent',
              color: 'secondary.main',
            },
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#7B27A2',
              color: 'secondary.main',
            },
          }}
        />
      </form>
    </div>
  );
};

export default TitleDisplay;
