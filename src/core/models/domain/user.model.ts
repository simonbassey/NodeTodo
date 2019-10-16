import mongoose, {Document, Types} from "mongoose";
import { DbContstants } from "./../../common/db.constants";

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    emailAddress: {type: String, required: true, index: true},
    password: {type: String, required: true}
});

export interface UserDocument extends Document {
    firstName: string;
    lastName: string;
    emailAddress: string;
    password: string;
}

export const UserModel = mongoose.model<UserDocument>(DbContstants.Users, userSchema);

export interface SignInResult {
    accessToken: string;
    refreshToken: string;
}

export interface AuthenticationResult  {
    isAuthenticated: boolean;
    info: UserDocument | any;
}

export interface JwtAuthObj {
    userId: string;
    email: string;
    provider: string;
    name: string;
}

export interface SignedInUser  {
    userId: string;
    email: string;
    claims: string[];
}
