import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {Settings} from "../settings.service";
export  const authorize = async (req: Request, res: Response, next: any) => {
    try {
        if (!req.headers["authorization"]) {
            return res.status(401).send();
        }
        const authHeader = req.headers["authorization"].split(" ");
        if (authHeader[0] !== "Bearer") {
            return res.status(401).send();
        }
        const vericationResult = jwt.verify(authHeader[1], Settings.authSecret);
        next();
    }
    catch (error) {
        res.status(403).send();
    }
};
