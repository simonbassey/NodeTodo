import express, {Request, Response, NextFunction} from "express";
import { AuthService } from "../../core/services/auth.service";
import { Logger } from "../../core/services/logger.service";
import {UserDocument} from "../../core/models/domain/user.model";
import { UserRepository } from "../../core/data/user.repository";
const accountRouter = express.Router();

const _authService: AuthService = new AuthService(new UserRepository()); // Introduce Dependency Injection
const _userRepository: UserRepository = new UserRepository();
accountRouter.post("/auth", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userName = req.body["username"];
        const password = req.body["password"];
        const result = await _authService.AuthenticateUser(userName, password);
        if (!result.isAuthenticated) {
            return res.status(400).send(`Incorrect username or password`);
        }
        // go ahead and create jwtToken and add the neccessary tokens to the middleware
        const signedInResult = _authService.createJwtToken(result.info);
        return res.status(200).send(signedInResult);
    }
    catch (error) {
        Logger.Error(error);
        return res.status(500).send(error);
    }
});

accountRouter.post("/signup", async (req, res) => {
    try {
        const accountObj = {emailAddress: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password};
        const existintUsersWithSameEmail = await _userRepository.filterUsers({emailAddress: accountObj.emailAddress});
        if (existintUsersWithSameEmail.length > 0) {
            return res.status(400).send(`A user account already exist for ${accountObj.emailAddress}`);
        }
        const createResult = await _userRepository.addUser(accountObj as UserDocument);
        if (createResult._id) {
            delete createResult.password;
            return res.status(201).send(sanitizeModel(createResult));
        }
        return res.status(204).send();
    }
    catch (error) {
        Logger.Error(`Error occured while creating user => ${error}`);
        return res.status(500).send(error);
    }
});

function sanitizeModel<T>(obj: T | any): T {
    const model = obj as any;
    delete model["_id"];
    delete model["__v"];
    return model as T;
}
export default accountRouter;
