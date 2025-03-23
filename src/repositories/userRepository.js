import User from "../models/userModel.js";
import Company from "../models/companyModel.js";

const findUserByName = async (username) => {
  return await User.findOne({ where: { username } });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const createCompany = async (companyName) => {
  const existingCompany = await Company.findOne({ where: { companyName } });
  if (existingCompany) {
    return existingCompany;
  } else {
    return await Company.create({ companyName, description: "", active: true });
  }
};


export { findUserByName, createUser, createCompany };