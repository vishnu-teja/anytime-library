import React from 'react';

const Profile = props => {
  return (
    <div>
      <img src={props.user.image} alt={props.user.name} />
    </div>
  );
};

export default Profile;
