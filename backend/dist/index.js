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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
dotenv_1.default.config();
const routes_1 = __importDefault(require("./routes"));
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
                this.pool = new pg_1.Pool();
                const dbInstance = yield this.pool.connect();
                dbInstance
                    ? console.log(`Connected to the database successfully 🤖`)
                    : console.log(`Something went wrong while connecting to the db ☹`);
                dbInstance.release();
            }
            catch (error) {
                console.error(`Error connecting to the database:`, error.message);
            }
        });
    }
    routerConfig() {
        this.app.use('/', routes_1.default);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`listening on port: ${port} 😎`);
        });
    }
}
exports.default = Server;
