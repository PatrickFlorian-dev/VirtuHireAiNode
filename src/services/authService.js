import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByName, createUser } from "../repositories/userRepository.js";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await createUser({ name, email, password: hashedPassword });
};

const loginUser = async (name, password) => {

    const user = await findUserByName(name);
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
        { id: user.id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user.id, name: user.name },
        process.env.REFRESH_SECRET
    );

    return { accessToken, refreshToken, user };

};

export { registerUser, loginUser };
