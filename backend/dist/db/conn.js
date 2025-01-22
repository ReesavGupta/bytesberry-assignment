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
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.Pool({
            max: 20,
            host: process.env.POSTGRES_HOST || 'localhost',
            port: Number(process.env.POSTGRES_PORT) || 5432,
            database: process.env.POSTGRES_DB || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'mypassword',
            user: process.env.POSTGRES_USER || 'postgres',
            idleTimeoutMillis: 30000,
        });
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
                yield pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          progress DECIMAL(5, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
                yield pool.query(`
        CREATE TABLE IF NOT EXISTS subtodos (
          id SERIAL PRIMARY KEY,
          todo_id INT NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          is_completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
                console.log('Tables created successfully');
            }
            catch (error) {
                console.log(`something went wrong while creating tables: ${error}😫`);
            }
        }))();
        return pool;
    });
}
exports.default = dbConnect;
