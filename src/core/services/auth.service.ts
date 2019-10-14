import {UserRepository} from "../data/user.repository";
import {Util} from "./utils.service";
import {AuthenticationResult, SignInResult} from "../models/todos";
export class AuthService {
    private _userRepository: UserRepository;
    constructor() {
        this._userRepository = new UserRepository();
    }

    public async AuthenticateUser(username: string, password: string): Promise<AuthenticationResult> {
        try {

            const pwHash = Util.Hash("sha512", password);
            const user = (await this._userRepository.filterUsers({email: username, password: pwHash}))[0];
            if (!user) {
                return {isAuthenticated: false, info: null};
            }
            return {isAuthenticated: true, info: user};
        }
        catch (error) {
            throw error;
        }
    }

    public async SignInUser(username: string, password: string): Promise<SignInResult> {
        return Promise.resolve({status: false, data: null});
    }

}
