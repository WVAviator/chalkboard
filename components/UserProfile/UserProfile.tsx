import {
  Avatar,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { MouseEvent } from 'react';
import styles from './UserProfile.module.css';

interface UserProfileProps {
  onLoginAttempt?: () => void;
  onLogout?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  onLoginAttempt = () => {},
  onLogout = () => {},
}) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onLoginAttempt();
    signIn();
  };

  const handleSignOut = () => {
    setAnchorEl(null);
    onLogout();
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My Account</MenuItem>
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
