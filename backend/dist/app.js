"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const port = Number(process.env.PORT) || 3001;
const serverInstance = new index_1.default();
serverInstance.start(port);
exports.default = serverInstance.app;
