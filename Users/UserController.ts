import {Request, Response, Express} from "express";
import UserDao from "./UserDao";

export default class UserController {
    // attributes
    app: Express;
    userDao: UserDao;

    constructor(app: Express, userDao: UserDao) {
        this.app = app;
        this.userDao = userDao;
        // Set attributes of app attribute
        this.app.get('/users', this.findAllUsers);
    }

    findAllUsers = async (req: Request, res: Response) => {
        const allUsers = await this.userDao.findAllUsers();
        // send response JSON
        res.json(allUsers)
    }

}