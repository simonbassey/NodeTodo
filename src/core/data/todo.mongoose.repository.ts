const mongoose = require("mongoose");
import { DbContstants } from "./../common/db.constants";
import {TodoModel, UserDocument, TodoDocument} from "./../models/domain/todo.model";
import { Logger } from "../services/logger.service";

export class TodoMongooseRepository {
    /**
     *
     */
    constructor() {
        this._doDbConnection();
    }

    private async _doDbConnection() {
        mongoose.connect(DbContstants.Connection.devConnectionString);
        mongoose.connection.on(`open`, (err: any, res: any) => {
            if (err) {
                console.log(`Encountered an error while connecting to database on ${DbContstants.Connection.devConnectionString}`);
            } else {
                console.log(`Connected to database on ${DbContstants.Connection.devConnectionString}`);
            }
        });
    }

    public async addTodo(doc: TodoDocument | any): Promise<TodoDocument> {
        try {
            const saveResult = await TodoModel.create(doc);
            return saveResult as TodoDocument;
        }
        catch (error) {
            throw error;
        }
    }

    public async getTodos(): Promise<TodoDocument[]> {
        try {
            const todos = await TodoModel.find({}).sort({createdDate: 1}).exec();
            Logger.Info(todos);
            return todos;
        }
        catch (error) {
            throw error;
        }
    }

    public async getTodo(id: string): Promise<TodoDocument> {
        try {
            const todo = await TodoModel.findById(id).exec();
            return todo;
        }
        catch (error) {
            if (error["name"] === "CastError" && error["kind"] === "ObjectId") {
                return null;
            }
            throw error;
        }
    }

    public async updateTodo(id: string, updatedTodo: TodoDocument | any): Promise<boolean> {
        try {
            const item = await this.getTodo(id);
            if (!item) {
                return false;
            }
            item.title = updatedTodo.title;
            item.description = updatedTodo.description;
            item.completed = updatedTodo.completed;
            item.lastUpdated = new Date();
            const res = await TodoModel.updateOne({_id: id}, item).exec();
            return !res ? false : true;
        }
        catch (error) {
            throw error;
        }
    }

    public async deleteTodo(id: string): Promise<boolean> {
        try {
            return await TodoModel.findByIdAndRemove(id).exec() != null;
        }
        catch (error) {
            throw error;
        }
    }

    public async filterTodos(filter: any): Promise<TodoDocument[]> {
        try {
            return await TodoModel.find(filter).exec();
        }
        catch (error) {
            throw error;
        }
    }
}
