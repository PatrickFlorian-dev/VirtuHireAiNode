import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByName, createUser, createCompany } from "../repositories/userRepository.js";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (userPayload) => {
    userPayload.password = await bcrypt.hash(userPayload.password, 10);
    return await createUser(userPayload);
};

const createdCompany = async (companyName) => {
    return await createCompany(companyName);
}

const loginUser = async (username, password) => {

    const user = await findUserByName(username);
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        consoleLogger('*** Error ***', `Login Failed - Invalid credentials`, '#e74c3c');
        throw new Error("Login Failed - Invalid credentials");
    }

    consoleLogger('*** Ok ***', `Login OK`, '#2ecc71');

    const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.REFRESH_SECRET
    );

    return { accessToken, refreshToken, user };

};

export { registerUser, loginUser, createdCompany };
