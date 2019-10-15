const mongoose = require("mongoose");
import { DbContstants } from "../common/db.constants";
import {TodoModel, UserDocument, TodoDocument, UserModel} from "../models/domain/todo.model";
import { Logger } from "../services/logger.service";
import {Util} from "../services/utils.service";

export class UserRepository {
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

    public async addUser(doc: UserDocument ): Promise<UserDocument> {
        try {
            doc.password = await Util.BcryptHash(doc.password);
            const saveResult = await UserModel.create(doc);
            delete saveResult.__v;
            delete saveResult.id;
            return saveResult;
        }
        catch (error) {
            throw error;
        }
    }

    public async getUsers(): Promise<UserDocument[]> {
        try {
            const colsToReturn = `firstName lastName, emailAddress`;
            const users = await UserModel.find({}, colsToReturn).exec();
            Logger.Info(users);
            return users;
        }
        catch (error) {
            throw error;
        }
    }

    public async getUser(userId: string): Promise<UserDocument> {
        try {
            const user = await UserModel.findById({_id: userId}).exec();
            delete user["id"];
            delete user["__v"];
            return user;
        }
        catch (error) {
            if (error["name"] === "CastError" && error["kind"] === "ObjectId") {
                return null;
            }
            throw error;
        }
    }

    public async updateTodo(userId: string, updateInfo: UserDocument | any): Promise<boolean> {
        try {
            const user = await this.getUser(userId);
            if (!user) {
                return false;
            }
            user.firstName = user.firstName;
            user.lastName = user.lastName;
            const res = await UserModel.updateOne({_id: userId}, user).exec();
            Logger.Info(`user update result -> ` + res);
            return !res ? false : true;
        }
        catch (error) {
            throw error;
        }
    }

    public async deleteUser(id: string): Promise<boolean> {
        try {
            return await TodoModel.findByIdAndRemove(id).exec() != null;
        }
        catch (error) {
            throw error;
        }
    }

    public async filterUsers(filter: any): Promise<UserDocument[]> {
        try {
            return await UserModel.find(filter).exec();
        }
        catch (error) {
            throw error;
        }
    }
}
