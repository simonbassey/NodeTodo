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

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    emailAddress: {type: String, required: true, index: true},
    passowrd: {type: String, required: true}
});

export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    emailAddress: string;
    passowrd: string;
}

export interface TodoDocument extends Document {
    title: string;
    description: string;
    userId: string;
    completed: boolean;
    createdDate: Date;
    lastUpdated: Date;
}
export const UserModel = mongoose.model<UserDocument>(DbContstants.Users, userSchema);
export const TodoModel =  mongoose.model<TodoDocument>(DbContstants.Todos, todoItemSchema);
