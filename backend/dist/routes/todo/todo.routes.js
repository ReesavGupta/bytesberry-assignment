"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todo_controller_1 = __importDefault(require("../../controllers/todo.controller"));
function todoRouterHandler(db) {
    const router = (0, express_1.Router)();
    const todoController = new todo_controller_1.default(db);
    router.get('/get-todos/:userId', todoController.getTodos);
    router.get('/get-todo/:todoId', todoController.getTodoById);
    router.post('/create-todo', todoController.createTodo);
    router.put('/update-todo/:todoId', todoController.updateTodo);
    router.delete('/delete-todo/:todoId', todoController.deleteTodo);
    router.post('/add-subtodo', todoController.addSubtodo);
    router.patch('/complete-subtodo/:subtodoId', todoController.completeSubtodo);
    return router;
}
exports.default = todoRouterHandler;
