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

        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        return sendPayloadResponse(res, {
            statusCode: 200,
            success: true,
            message: "User login success",
            data: { token: accessToken, user }
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


const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    try {

        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) return sendPayloadResponse(res, { statusCode: 403, success: false, message: "Invalid token", data: null });
        
            const newAccessToken = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "15m" }
            );
        
            return sendPayloadResponse(res, {
                statusCode: 200,
                success: true,
                message: "Token refreshed successfully",
                data: { token: newAccessToken }
            });
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

    return sendPayloadResponse(res, {
        statusCode: 201,
        success: true,
        message: "Logout success",
        data: { message: "User logged out successfully" }
    });

};

export { register, login, refreshToken, logout };
