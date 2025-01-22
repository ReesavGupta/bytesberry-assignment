"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
function userRouterHandler(db) {
    const router = (0, express_1.Router)();
    const userController = new user_controller_1.default(db);
    router.post('/signUp', userController.userSignUp);
    router.post('/signIn', userController.userSignIn);
    return router;
}
exports.default = userRouterHandler;
