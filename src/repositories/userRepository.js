import User from "../models/userModel.js";

const findUserByName = async (name) => {
  return await User.findOne({ where: { name } });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

export { findUserByName, createUser };