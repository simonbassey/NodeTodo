import express, { Request, Response } from "express";
import TodoRepository from "../../core/data/todo.repository";
import {TodoMongooseRepository} from "../../core/data/todo.mongoose.repository";
import TodoItem from "../../core/models/todos";
import { TodoDocument } from "../../core/models/domain/todo.model";

const router = express.Router();
const todoRepository = new TodoMongooseRepository();
router.get("/api/todos", (req, res) => {
    todoRepository.getTodos().then(
        (response) => {
            return res.status(200).json(response);
        },
        (error) => {
            return res.status(500).send(error);
        }
    );
});

router.post("/api/todos/create", async (req, res) => {
    try {
        const payload: any = { title: req.body["title"], description: req.body["description"], userId: req.body["userId"]};
        const validationErrors = validateReqPayload(payload);
        if (validationErrors.length > 0) {
            return res.status(400).json(validationErrors);
        }
        if (await todoExist(payload.userId, payload.title)) {
            return res.status(400).json(`A similar activity with the same title '${payload.title}' already exist`);
        }
        const result = await todoRepository.addTodo(payload);
        return  !result ? res.status(204).send() : res.status(201).send(result);
    }
    catch (exception) {
        return res.status(500).send(exception);
    }
});

router.get("/api/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await todoRepository.getTodo(id);
        return res.status(200).json(todo);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

router.put("/api/todos/:id/update", async (req, res) => {
    try {
        const id = req.params.id;
        const payload = {title: req.body["title"], description: req.body["description"], completed: req.body["completed"], userId: req.body["userId"]} as TodoDocument;
        const validationErrors = validateReqPayload(payload);
        if (validationErrors.length > 0) {
            return res.status(400).json(validationErrors);
        }
        const updateResult = await todoRepository.updateTodo(id, payload);
        if (!updateResult){
            return res.status(400).send({status: false, message: "Failed to update todo item"});
        }
        return res.status(200).send({status: true, message: "successfully updated item"});
    }
    catch (error) {
        return res.status(500).send(error);
    }
});

router.delete("/api/todos/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const deleted = await todoRepository.deleteTodo(_id);
        return res.status(200).send({status: deleted ? "success" : "failed", message: deleted ? "Requested Todo has been removed from db" : "Failed to remove requested todo from the database"});
    }
    catch (error) {
        return res.status(500).send(error);
    }
});

function validateReqPayload(payload: TodoDocument): any[] {
    const errors = [];
    if (!payload.title || payload.title.trim().length < 3){
        errors.push({param: "title", error: "Invalid title. must be 3 characters or more"});
    }
    if (!payload.description || payload.description.trim().length < 1) {
        errors.push({param: "description", error: "Invalid. Please provide a valid description for this activity"});
    }
    if (!payload.userId || payload.userId.trim().length < 1) {
        errors.push({param: "userId", error: "You must be signed in as a user to create Todo items"});
    }

    return errors;
}

async function todoExist(userId: string, title: string): Promise<boolean> {
    title = title ? title.toLowerCase().trim() : "";
    const userTodos = await todoRepository.filterTodos({userId});
    const todo = userTodos.length < 1 ? null : userTodos.find((td) => td.title.toLowerCase() === title.toLowerCase());
    return todo && todo.title ? true : false;
}

export default router;
