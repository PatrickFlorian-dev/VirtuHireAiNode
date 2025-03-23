import { registerUser, loginUser, createdCompany } from "../services/authService.js";
import { sendPayloadResponse } from "../utils/responsePayload.js";

let refreshTokens = [];

const register = async (req, res) => {
    const reqUser = req.body;
    const { username, email, password, companyName } = req.body;

    if (!username || !email || !password || !companyName) {
        return sendPayloadResponse(res, {
            statusCode: 400,
            success: true,
            message: "Username, email, password, and companyName are required",
            data: { message: "Username, email, password, and companyName are required" }
        });
    }

    try {
        const company = await createdCompany(companyName);
        reqUser.companyId = company.id;
        const user = await registerUser(reqUser);

        return sendPayloadResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: { user}
        });

    } catch (error) {

        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `Server error: ${error.message}`,
            data: { message: `Server error: ${error.message}` }
        });

    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { accessToken, refreshToken, user } = await loginUser(username, password);

        //consoleLogger('*** Ok ***', `${accessToken}`, '#2ecc71');
        //consoleLogger('*** Ok ***', `${refreshToken}`, '#2ecc71');
        //consoleLogger('*** Ok ***', `${user}`, '#2ecc71');

        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        res.json({ token: accessToken, user });

        return sendPayloadResponse(res, {
            statusCode: 201,
            success: true,
            message: "User login success",
            data: { user }
        });

    } catch (error) {

        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `Server error: ${error.message}`,
            data: { message: `Server error: ${error.message}` }
        });
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

        return sendPayloadResponse(res, {
            statusCode: 201,
            success: true,
            message: "Refresh token success",
            data: { token: newAccessToken }
        });

    } catch (error) {
        
        return sendPayloadResponse(res, {
            statusCode: 500,
            success: false,
            message: `Server error: ${error.message}`,
            data: null
        });

    }

};

const logout = (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
    res.clearCookie("refreshToken");
    res.json({ message: "User logged out successfully" });

    return sendPayloadResponse(res, {
        statusCode: 201,
        success: true,
        message: "Logout success",
        data: { message: "User logged out successfully" }
    });

};

export { register, login, refreshToken, logout };
