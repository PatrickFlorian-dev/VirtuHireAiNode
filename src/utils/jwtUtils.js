import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, name: user.name }, process.env.REFRESH_SECRET);
};

export { generateAccessToken, generateRefreshToken };
