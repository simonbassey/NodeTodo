import mongoose, {Schema, Document, Types} from "mongoose";
import { DbContstants } from "./../../common/db.constants";

const todoItemSchema =  new mongoose.Schema({
    title: {type: String, required: true, index: true},
    description: {type: String, required: true},
    userId: {type: String, required: true},
    completed: {type: Boolean, default: false},
    createdDate: {type: Date, default: Date.now},
    lastUpdated: {type: Date}
});



export interface TodoDocument extends Document {
    title: string;
    description: string;
    userId: string;
    completed: boolean;
    createdDate: Date;
    lastUpdated: Date;
}
export const TodoModel =  mongoose.model<TodoDocument>(DbContstants.Todos, todoItemSchema);
