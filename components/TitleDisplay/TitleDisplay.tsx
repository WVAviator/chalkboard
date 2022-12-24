import { Button, IconButton, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import styles from './TitleDisplay.module.css';
import EditIcon from '@mui/icons-material/Edit';
import styled from '@emotion/styled';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';

interface TitleDisplayProps {}

const TitleDisplay: React.FC<TitleDisplayProps> = () => {
  const [editing, setEditing] = React.useState<boolean>(false);

  const { title, setTitle } = useChalkboardDataStore((state) => ({
    title: state.chalkboardTitle,
    setTitle: state.updateTitle,
  }));

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDisableEdit = (event: React.FormEvent) => {
    event.preventDefault();
    setEditing(false);
  };

  const handleEnableEdit = (event: React.FormEvent) => {
    event.preventDefault();
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  return (
    <div className={styles.container}>
      <IconButton aria-label="edit" onClick={handleEnableEdit} size="small">
        <EditIcon
          sx={{ color: '#FFFFFF30', transform: 'translateY(-2.25px)' }}
          fontSize="small"
        />
      </IconButton>
      <TextField
        id="title"
        variant="standard"
        onChange={handleChange}
        inputRef={inputRef}
        value={title}
        color="secondary"
        onBlur={handleDisableEdit}
        disabled={!editing}
        sx={{
          input: {
            color: 'white',
          },

          '& .MuiInput-underline:before': {
            borderBottomColor: editing ? 'white' : 'transparent',
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: editing ? 'white' : 'transparent',
            color: 'white',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: editing ? 'white' : 'transparent',
            color: 'white',
          },
          '& .MuiInputBase-input.Mui-disabled': {
            WebkitTextFillColor: '#FFFFFF',
            color: 'white',
          },
        }}
      />
    </div>
  );
};

export default TitleDisplay;
