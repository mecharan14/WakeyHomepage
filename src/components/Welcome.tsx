import React from 'react';

interface WelcomeProps {
  username: string;
}

const Welcome: React.FC<WelcomeProps> = ({ username }) => {
  return (
    <center>
      <h1 id="title">Welcome {username}</h1>
    </center>
  );
};

export default Welcome;
