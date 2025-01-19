"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("./user/user.routes"));
const user_routes_2 = __importDefault(require("./user/user.routes"));
const router = (0, express_1.Router)();
router.use('/user', user_routes_1.default);
router.use('/todo', user_routes_2.default);
exports.default = router;
