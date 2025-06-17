"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function hashPassword(password) {
    const salt = 12;
    return await bcryptjs_1.default.hash(password, salt);
}
async function verifyPassword(password, hashedPassword) {
    return await bcryptjs_1.default.compare(password, hashedPassword);
}
function generateToken(userId) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d"),
    };
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, options);
}
function verifyToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return { userId: decoded.userId };
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error("Invalid token:", error.message);
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error("Token expired:", error.message);
        }
        else {
            console.error("Error verifying token:", error);
        }
        return null;
    }
}
//# sourceMappingURL=auth.js.map