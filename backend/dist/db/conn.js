"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
exports.default = new pg_1.Pool({
    max: 20,
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    password: 'mypassword',
    user: 'postgres',
    idleTimeoutMillis: 30000,
});
