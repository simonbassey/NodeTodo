import express from "express";
import { SignedInUser } from "../../core/models/domain/user.model";
export interface AuthenticatedRequest extends express.Request {
    User: SignedInUser;
}
