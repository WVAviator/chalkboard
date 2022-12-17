import { CircularProgress } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <CircularProgress />;
  }

  return (
    <div className={styles.container}>
      {session ? (
        <div>{session.user.email}</div>
      ) : (
        <a
          href={`/api/auth/signin`}
          onClick={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          Login
        </a>
      )}
    </div>
  );
};

export default UserProfile;
