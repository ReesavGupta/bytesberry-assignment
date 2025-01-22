"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    constructor(db) {
        this.userSignUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password, } = req.body;
                if (!username.trim() || !email.trim() || !password.trim()) {
                    res.status(400).json({ message: `All credentials are required` });
                }
                const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
                const emailCheckResult = yield this.dbConnection.query(emailCheckQuery, [
                    email,
                ]);
                if (emailCheckResult.rows.length > 0) {
                    res.status(400).json({ message: `Email is already registered` });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const insertQuery = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
      `;
                const values = [username, email, hashedPassword];
                const result = yield this.dbConnection.query(insertQuery, values);
                res.status(201).json({
                    message: `User created successfully`,
                    user: result.rows[0],
                });
            }
            catch (error) {
                console.error(`Error in createUser:`, error);
                res
                    .status(500)
                    .json({ message: `Something went wrong while creating a user` });
            }
        });
        this.userSignIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Credentials are required' });
                return;
            }
            const emailCheckQuery = `SELECT * FROM users WHERE email = $1`;
            const emailCheckResult = yield this.dbConnection.query(emailCheckQuery, [
                email,
            ]);
            if (emailCheckResult.rows.length === 0) {
                res.status(404).json({ message: 'User is not registered' });
                return;
            }
            const user = emailCheckResult.rows[0];
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            // we can definetly set it to cookies but that would only overengineer the assignment. So just sending back the response ✌
            res.status(200).json({
                message: 'User signed in successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            });
        });
        this.dbConnection = db;
    }
}
exports.default = UserController;
