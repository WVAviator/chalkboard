import { NextPage } from 'next';
import Chalkboard from '../components/Chalkboard/Chalkboard';
import UserProfile from '../components/UserProfile/UserProfile';

const HomePage: NextPage = () => {
  return (
    <div>
      <UserProfile />
      <Chalkboard />
    </div>
  );
};

export default HomePage;
