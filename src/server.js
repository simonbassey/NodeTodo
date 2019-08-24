// const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const fileHelper = require('./core/services/file.helper.service')

const port = process.env.port || 3000;
const app = express();

app.use(morgan());
app.use(bodyParser.json());

const todoStore = [];

app.get('/', (req,res) => {
    const welcomeMsg = `Hello ${req.ip} .. Welcome to classic Todo API`;
    res.write(welcomeMsg);
    res.end();
})

app.get('/api/todos', (req, res) => {
    return res.status(200).json(todoStore);
});

app.post('/api/todos/create', (req, res) => {
    const payload = {title: req.body['title'], description: req.body['description']};
    const validationErrors = validateReqPayload(payload);
    if(validationErrors.length > 0) 
        return res.status(400).json(validationErrors);
    if (todoExist(payload.title))
        return res.status(400).json(`A similar activity with the same title '${payload.title}' already exist`);
    payload['id'] = todoStore.length + 1;
    todoStore.push(payload);
    return res.status(201).send();
})

app.get('/api/todos/:id', (req, res) => {
    const id = req.route.id;
    if(!id || id < 1 || id > todoStore.length -1)
        return res.status(400).send('No activity found with provided Id');
    const todo = todoStore.find( t => t.id == id);
    return res.status(200).json(todo);
});

app.put('/api/todos/:id/update', (req, res) => {
    const id = req.route.id;
    if(!id || id < 1 || id > todoStore.length -1 || todoStore.indexOf(td => td.id == id) < 0) {
        return res.status(400).send('Bad Request: No activity found with provided Id');
    }   
    const payload = {title: req.body['title'], description: req.body['description']};
    const validationErrors = validateReqPayload(payload);
    if(validationErrors.length > 0) {
        return res.status(400).json(errors);
    }
    const indexOfTodoToUpdate = todoStore.indexOf(td => td.id == id);
    const todoToUpdate = todoStore[indexOfTodoToUpdate];
    if(!todoToUpdate){
        return res.status(400).json(`Bad request. Invalid activity Id ${id}`);
    }
    todoToUpdate['title'] = payload.title;
    todoToUpdate['description'] = payload.description;
    todoStore[indexOfTodoToUpdate] = todoToUpdate;
    return res.status(204).send();
})


function validateReqPayload(payload) {
    const errors = [];
    if (!payload.title || payload.title.trim().length < 3){
        errors.push({param: 'title', error: 'Invalid title. must be 3 characters or more'});
    }
    if (!payload.description || payload.description.trim().length < 1) {
        errors.push({param: 'description', error: 'Invalid. Please provide a valid description for this activity'});   
    }
    return errors;
}

function todoExist(title) {
    title = title ? title.toLowerCase().trim() : '';
    return todoStore.find(td => title && td.title.trim().toLowerCase() == title);
}

app.listen(port, () => { console.log(`Server started .. listening on port ${port}`)});
