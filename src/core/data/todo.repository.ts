import mongodb, { MongoClient, Db } from "mongodb";
import TodoItem, { DbActionResult } from "./../models/todos";

class TodoRepository {

    private dbClient: MongoClient;
    private _todoCollection: string = "_activities";
    constructor() {
        this.dbClient = new mongodb.MongoClient("mongodb://localhost:27017");
    }

    private connect(): Promise<Db> {
        return new Promise((resolve, reject) => {
            this.dbClient.connect().then(
                (res) => {
                    const db = res.db("nodeTodoDb");
                    resolve(db);
                },
                (error) => reject(error)
            );
        });
    }

    public async addTodo(todoDoc: TodoItem): Promise<TodoItem> {
        try {
            const db = await this.connect();
            const result = await db.collection(this._todoCollection).insertOne(todoDoc);
            if (result.insertedId) {
                todoDoc.setId(result.insertedId);
                return todoDoc;
            }
            return null;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    public async getTodos(): Promise<any> {
        try {
            const db = await this.connect();
            const todos = await db.collection<TodoItem>(this._todoCollection).find({}).project({title : 1, description : 1, _id: 1 }).toArray();
            console.log(todos);
            return todos;
        }
        catch (error) {
            console.log("exception while querying Todos -> ", error);
            throw error;
        }
    }

    public async getTodo(id: any): Promise<TodoItem> {
        try {
            const db = await this.connect();
            const todo = await db.collection<TodoItem>(this._todoCollection).findOne({_id: id});
            return todo;
        }
        catch (exception) {
            throw exception;
        }
    }

    public async getTodoByTitle(title: any): Promise<TodoItem> {
        try {
            const db = await this.connect();
            const todo = await db.collection<TodoItem>(this._todoCollection).findOne({title});
            return todo;
        }
        catch (exception) {
            throw exception;
        }
    }

    public async updateTodo(id: any, item: TodoItem): Promise<DbActionResult> {
        try {
            const db = await this.connect();
            const collection = db.collection<TodoItem>(this._todoCollection);
            const targetTodo = await collection.findOne({_id: id});
            if (!targetTodo) {
                return {status: false, message: `Could find any todo with Id ${id}`};
            }
            const result = await collection.updateOne({_id: id}, {$set: {title: item.title, description: item.description}});
            return {
                status: result.modifiedCount === 1,
                message: result.modifiedCount === 1 ? "Updated successfuly" : "Failed to update todo item"
            };

        }
        catch (error) {
            console.log(`Encountered an error while updating item -> `, error);
            throw error;
        }
    }

    public async RemoveTodo(id: any, item: TodoItem = null) {
        try {
            const db = await this.connect();
            const collection = db.collection<TodoItem>(this._todoCollection);
            const targetTodo = await collection.findOne({_id: id});
            if (!targetTodo) {
                return {status: false, message: `Could find any todo with Id ${id}`};
            }
            const result = await collection.deleteOne({_id: id});
            return {
                status: result.deletedCount === 1,
                message: result.deletedCount === 1 ? "Updated successfuly" : "Failed to update todo item"
            };

        }
        catch (error) {
            console.log(`Encountered an error while updating item -> `, error);
            throw error;
        }
    }
}

export default TodoRepository;
