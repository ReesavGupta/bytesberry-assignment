"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const conn_1 = __importDefault(require("./db/conn"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.dbConfig();
        this.routerConfig();
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    dbConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('connecting to the db...');
                this.dbInstance = yield (0, conn_1.default)();
                const connectionCheck = yield this.dbInstance.connect();
                connectionCheck
                    ? console.log(`Connected to the database successfully 🤖`)
                    : console.log(`Something went wrong while connecting to the db ☹`);
                connectionCheck.release();
            }
            catch (error) {
                console.error(`Error connecting to the database:`, error);
            }
        });
    }
    routerConfig() {
        if (!this.dbInstance) {
            console.error('Database instance is not available, skipping router configuration.');
            return;
        }
        // this.app.use('/', serverRouter(this.dbInstance))
        const router = (0, express_1.Router)();
        router.get('/', (req, res) => {
            console.log(`server is working`);
            res.send(`server is working`);
        });
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`listening on port: ${port} 😎`);
        });
    }
}
exports.default = Server;
