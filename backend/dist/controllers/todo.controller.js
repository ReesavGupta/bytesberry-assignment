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
Object.defineProperty(exports, "__esModule", { value: true });
class TodoController {
    constructor(db) {
        this.getTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const result = yield this.dbConnection.query(`SELECT * FROM todos WHERE user_id = $1`, [userId]);
                res.status(200).json(result.rows);
            }
            catch (error) {
                console.error('Error fetching todos:', error);
                res.status(500).json({ error: 'Failed to fetch todos' });
            }
        });
        this.getTodoById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId } = req.params;
            try {
                const todoResult = yield this.dbConnection.query(`SELECT * FROM todos WHERE id = $1`, [todoId]);
                const subtodoResult = yield this.dbConnection.query(`SELECT * FROM subtodos WHERE todo_id = $1`, [todoId]);
                if (todoResult.rows.length === 0) {
                    res.status(404).json({ error: 'Todo not found' });
                }
                else {
                    res.status(200).json({
                        todo: todoResult.rows[0],
                        subtodos: subtodoResult.rows,
                    });
                }
            }
            catch (error) {
                console.error('Error fetching todo:', error);
                res.status(500).json({ error: 'Failed to fetch todo' });
            }
        });
        this.createTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId, title, subtodos, } = req.body;
            const client = yield this.dbConnection.connect();
            try {
                yield client.query('BEGIN');
                const todoResult = yield client.query(`INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *`, [userId, title]);
                const todo = todoResult.rows[0];
                const subtodoPromises = (subtodos || []).map((subtodoTitle) => {
                    return client.query(`INSERT INTO subtodos (todo_id, title) VALUES ($1, $2) RETURNING *`, [todo.id, subtodoTitle]);
                });
                const subtodoResults = yield Promise.all(subtodoPromises);
                const createdSubtodos = subtodoResults.map((result) => result.rows[0]);
                yield client.query('COMMIT');
                res.status(201).json({
                    todo,
                    subtodos: createdSubtodos,
                });
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Error creating todo with subtodos:', error);
                res.status(500).json({ error: 'Failed to create todo with subtodos' });
            }
            finally {
                client.release();
            }
        });
        this.updateTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId } = req.params;
            const { title } = req.body;
            try {
                const result = yield this.dbConnection.query(`UPDATE todos SET title = $1 WHERE id = $2 RETURNING *`, [title, todoId]);
                if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Todo not found' });
                }
                else {
                    res.status(200).json(result.rows[0]);
                }
            }
            catch (error) {
                console.error('Error updating todo:', error);
                res.status(500).json({ error: 'Failed to update todo' });
            }
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId } = req.params;
            try {
                yield this.dbConnection.query(`DELETE FROM subtodos WHERE todo_id = $1`, [
                    todoId,
                ]);
                const result = yield this.dbConnection.query(`DELETE FROM todos WHERE id = $1 RETURNING *`, [todoId]);
                if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Todo not found' });
                }
                else {
                    res.status(200).json({ message: 'Todo deleted successfully' });
                }
            }
            catch (error) {
                console.error('Error deleting todo:', error);
                res.status(500).json({ error: 'Failed to delete todo' });
            }
        });
        this.addSubtodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId, title } = req.body;
            try {
                const result = yield this.dbConnection.query(`INSERT INTO subtodos (todo_id, title) VALUES ($1, $2) RETURNING *`, [todoId, title]);
                res.status(201).json(result.rows[0]);
            }
            catch (error) {
                console.error('Error adding subtodo:', error);
                res.status(500).json({ error: 'Failed to add subtodo' });
            }
        });
        this.completeSubtodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { subtodoId } = req.params;
            try {
                const result = yield this.dbConnection.query(`UPDATE subtodos SET is_completed = TRUE WHERE id = $1 RETURNING *`, [subtodoId]);
                if (result.rows.length === 0) {
                    res.status(404).json({ error: 'Subtodo not found' });
                }
                else {
                    res.status(200).json(result.rows[0]);
                }
            }
            catch (error) {
                console.error('Error completing subtodo:', error);
                res.status(500).json({ error: 'Failed to complete subtodo' });
            }
        });
        this.recalculateProgress = (todoId) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const progressResult = yield this.dbConnection.query(`
        SELECT
          (COUNT(*) FILTER (WHERE is_completed) * 100.0 / NULLIF(COUNT(*), 0)) AS progress
        FROM subtodos
        WHERE todo_id = $1
        `, [todoId]);
                const progress = ((_a = progressResult.rows[0]) === null || _a === void 0 ? void 0 : _a.progress) || 0;
                yield this.dbConnection.query(`UPDATE todos SET progress = $1 WHERE id = $2`, [progress, todoId]);
            }
            catch (error) {
                console.error('Error recalculating progress:', error);
            }
        });
        this.dbConnection = db;
    }
}
exports.default = TodoController;
