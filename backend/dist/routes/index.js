"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user/user.routes"));
const todo_routes_1 = __importDefault(require("./todo/todo.routes"));
function serverRouter(db) {
    const router = (0, express_1.Router)();
    console.log(`ive reached index route`);
    router.use('/user', (0, user_routes_1.default)(db));
    router.use('/todo', (0, todo_routes_1.default)(db));
    return router;
}
exports.default = serverRouter;
