"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // In production, use environment variables
function generateToken(payload, expiresIn = "24h") {
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        return decoded;
    }
    catch (error) {
        console.log('Invalid or expired token:', error);
        return null;
    }
}
function decodeToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        return decoded;
    }
    catch (error) {
        console.log('Invalid token format:', error);
        return null;
    }
}
