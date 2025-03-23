import { registerUser, loginUser } from "../services/authService.js";

let refreshTokens = [];

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }

    try {
        const user = await registerUser(username, email, password);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Registration Error ❌:", error);
        res.status(500).json({ message: "Server error, please try again" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { accessToken, refreshToken, user } = await loginUser(username, password);

        consoleLogger('*** Ok ***', `${accessToken}`, '#2ecc71');
        consoleLogger('*** Ok ***', `${refreshToken}`, '#2ecc71');
        consoleLogger('*** Ok ***', `${user}`, '#2ecc71');

        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.json({ token: accessToken, user });
    } catch (error) {
        consoleLogger('*** Error ***', `Error: ${error.message}`, '#e74c3c');
        res.status(401).json({ message: error.message });
    }
};

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    try {
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
    
            const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "15m" });
            res.json({ token: newAccessToken });
        });
    } catch (error) {
        console.error("Registration Error ❌:", error);
        res.status(500).json({ message: "Server error, please try again" });
    }

};

const logout = (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.json({ message: "User logged out successfully" });
};

export { register, login, refreshToken, logout };
