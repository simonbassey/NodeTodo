import jwt from "jsonwebtoken";
import {UserRepository} from "../data/user.repository";
import {Util} from "./utils.service";
import {AuthenticationResult, SignInResult, JwtAuthObj} from "../models/todos";
import { UserDocument } from "../models/domain/todo.model";
import { Settings } from "./settings.service";

export class AuthService {
    private _userRepository: UserRepository;
    constructor() {
        this._userRepository = new UserRepository();
    }

    public async AuthenticateUser(username: string, password: string): Promise<AuthenticationResult> {
        try {
            const users = (await this._userRepository.filterUsers({emailAddress: username}));
            if (!users || users.length < 1) {
                return {isAuthenticated: false, info: null};
            }
            const user = users[0];
            const _salt = new Buffer(`${[user.lastName]}${user.firstName}`).toString("base64");
            const pwHash = Util.Hash("sha512", password, _salt);
            return {isAuthenticated: user.password === pwHash, info: user.password !== pwHash ? null : user};
        }
        catch (error) {
            throw error;
        }
    }

    public SignInUser(signedInUser: UserDocument): SignInResult {
        try {
            if (!signedInUser) {
                throw new Error("Cnnot signIn a non valid user object");
            }
            const _appAuthSecret = Settings.authSecret;
            const authObj: JwtAuthObj = {userId: signedInUser.id, email: signedInUser.emailAddress, provider: "email", name: `${signedInUser.firstName} ${signedInUser.lastName}`};
            const token = jwt.sign(authObj, _appAuthSecret);
            const refreshToken = new Buffer(signedInUser.password).toString("base64");
            return {accessToken: token, refreshToken};
        }
        catch (error) {
            throw error;
        }
    }

}
