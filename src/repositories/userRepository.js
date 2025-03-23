import User from "../models/userModel.js";

const findUserByName = async (username) => {
  return await User.findOne({ where: { username } });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

export { findUserByName, createUser };