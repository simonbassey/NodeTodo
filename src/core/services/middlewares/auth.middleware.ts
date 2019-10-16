import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {Settings} from "../settings.service";
import { Logger } from "../logger.service";
import {AuthenticatedRequest} from "../../../api/helpers/request.helper";
import { SignedInUser } from "../../models/domain/user.model";

export  const authorize = async (req: AuthenticatedRequest, res: Response, next: any) => {
    try {
        if (!req.headers["authorization"]) {
            return res.status(401).send();
        }
        const authHeader = req.headers["authorization"].split(" ");
        if (authHeader[0] !== "Bearer") {
            return res.status(401).send();
        }
        const vericationResult = jwt.verify(authHeader[1], Settings.authSecret);
        if (!vericationResult) {
            return res.status(401).send();
        }
        req.User = vericationResult as SignedInUser;
        next();
    }
    catch (error) {
        Logger.Error(`error occured at authorization filter -> ${error}`);
        res.status(403).send();
    }
};
