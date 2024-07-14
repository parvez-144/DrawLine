const users = [];

//Add a user to the list
const addUser = ({ name, userId, roomId, host, presenter,socketId }) => {
  const  user ={ name, userId, roomId, host, presenter,socketId }
  users.push(user);
  return users.filter((user) => user.roomId === roomId);
};
//remove a user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.socketId === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
  return users;
};

//Get a user from the list
const getAllUsers=()=>{
  return users;
}

const getUser = (id) => {
  return users.find((user) => user.socketId === id);
};

//get all users from room

const getUserInRoom = (roomId) => {
  return users.filter((user) => user.roomId === roomId);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getAllUsers,
  getUserInRoom,
};
