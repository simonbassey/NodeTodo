import express from "express";
import { AuthService } from "../../core/services/auth.service";
import { Logger } from "../../core/services/logger.service";
const accountRouter = express.Router();

const _authService: AuthService = new AuthService();
accountRouter.post("/api/auth", async (req, res) => {
    try {
        const userName = req.body["username"];
        const password = req.body["password"];
        const result = await _authService.AuthenticateUser(userName, password);
        if (!result.isAuthenticated) {
            return res.status(400).send(`Incorrect username or password`);
        }
        // go ahead and signIn user with jwt and add the neccessary tokens to the middleware
    }
    catch (error) {
        Logger.Error(error);
        return res.status(500).send(error);
    }

});

accountRouter.post("/api/account/signup", async (req, res) => {
    try {
        
    }
    catch (error) {
        Logger.Error(`Error occured while creating user => ${error}`);
        return res.status(500).send(error);
    }
});
export default accountRouter;
