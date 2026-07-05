import { Request, Response } from "express";
import { User } from "../Models/UserModel";
declare global {
  declare namespace Express {
    export interface Request {
      currentUser: User;
      currentUserId: string;
      currentStorageUserId: string;
      local: {};
    }
    export interface Response {
      currentUser: User;
    }
  }
}


