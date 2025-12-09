const prisma = require('../prisma/client');

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const createUser = async (user) => {
  const newUser = await prisma.user.create({ data: user });
  return newUser;
};

module.exports = {
  getAllUsers,
  createUser,
};
