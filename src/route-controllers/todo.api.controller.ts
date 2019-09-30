import express from "express";
import TodoRepository from "./../core/data/todo.repository";
import TodoItem from "./../core/models/todos";

const router = express.Router();
const todoRepository = new TodoRepository();
router.get("/", (req, res) => {
    const welcomeMsg = `Hello ${req.ip} .. Welcome to classic Todo API`;
    res.write(welcomeMsg);
    res.end();
});

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
        const payload: any = { title: req.body["title"], description: req.body["description"]};
        const validationErrors = validateReqPayload(payload);
        if (validationErrors.length > 0) {
            return res.status(400).json(validationErrors);
        }
        if (await todoExist(payload.title)) {
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
    const id = req.route.id;
    const todo = await todoRepository.getTodo(id);
    return res.status(200).json(todo);
});

router.put("/api/todos/:id/update", async (req, res) => {
    const id = req.route.id;
    const payload = {title: req.body["title"], description: req.body["description"]} as TodoItem;
    const validationErrors = validateReqPayload(payload);
    if (validationErrors.length > 0) {
        return res.status(400).json(validationErrors);
    }
    const updateResult = await todoRepository.updateTodo(id, payload);
    if (updateResult.status){
        return res.status(400).json(`${updateResult.message}`);
    }
    return res.status(204).send();
});

function validateReqPayload(payload: any): any[] {
    const errors = [];
    if (!payload.title || payload.title.trim().length < 3){
        errors.push({param: "title", error: "Invalid title. must be 3 characters or more"});
    }
    if (!payload.description || payload.description.trim().length < 1) {
        errors.push({param: "description", error: "Invalid. Please provide a valid description for this activity"});
    }
    return errors;
}

async function todoExist(title: string): Promise<boolean> {
    title = title ? title.toLowerCase().trim() : "";
    return (await todoRepository.getTodoByTitle(title)) != null;
}

export default router;
