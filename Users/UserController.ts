import {Request, Response, Express} from "express";
import UserDao from "./UserDao";
import User from "./User";

export default class UserController {
    // attributes
    private static userDaoContAttr: UserDao = UserDao.getInstance();
    private static userContAttr: UserController | null = null;

    private constructor() {
    }
    public static getInstance(app:Express): UserController {
        if (UserController.userContAttr == null) {
            UserController.userContAttr = new UserController();
        }

        app.get('/users', UserController.userContAttr.findAllUsers)

        return UserController.userContAttr;
    }

    findAllUsers = async (req: Request, res: Response) => {
        const allUsers = await UserController.userDaoContAttr.findAllUsers();
        // send response JSON
        res.json(allUsers)
    }

}