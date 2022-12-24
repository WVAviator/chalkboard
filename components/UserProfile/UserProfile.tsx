import { Avatar, Button, Menu, MenuItem } from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { MouseEvent } from 'react';
import { useChalkboardDataStore } from '../../hooks/useChalkboardDataStore';
import styles from './UserProfile.module.css';

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = ({}) => {
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const saveToLocalStorage = useChalkboardDataStore(
    (state) => state.saveToLocalStorage
  );
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    saveToLocalStorage();
    signIn();
  };

  const handleSignOut = () => {
    setAnchorEl(null);
    saveToLocalStorage();
    signOut();
  };

  return (
    <div className={styles.container}>
      {session ? (
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color="secondary"
          >
            <div className={styles.avatar}>
              <Avatar src={session.user.image} />
            </div>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>My Profile</MenuItem>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
        </div>
      ) : (
        <Button
          href={`/api/auth/signin`}
          onClick={handleSignIn}
          variant="contained"
          color="secondary"
        >
          Sign in
        </Button>
      )}
    </div>
  );
};

export default UserProfile;
