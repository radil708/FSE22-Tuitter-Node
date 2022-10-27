import {Request, Response,Express} from "express";
import UserDao from "./UserDao";
import UserControllerInterface from "./UserControllerInterface";


export default class UserController implements UserControllerInterface {
    // attributes
    app: Express;
    userDao: UserDao = UserDao.getInstance();

    constructor(app: Express) {
        this.app = app;
        // Set attributes of app attribute
        this.app.get('/users', this.findAllUsers);
        this.app.get('/users/:userid', this.findUserById);
        this.app.post('/users', this.createUser);
        this.app.delete('/users/:userid', this.deleteUser);
        //this.app.put('/users/:userid', this.updateUser);
    }

    createUser = async (req: Request, res: Response) => {
        // assign variable to store POST JSON body from client
        const newUserJSON = req.body;
        // user model to create a new user in database
        const newUserObject = await this.userDao.createUser(newUserJSON);
        // add new user JSON info to response?
        res.send(newUserObject);
    }

    deleteUser = async (req: Request, res: Response) => {
        //TODO ask, by default params has a
        // userid comes from line18, i.e. the userid in the url
        // this has nothing to do with request JSON
        const userIdToDelete = req.params['userid'];

        let count = 0;
        //console.log(req.params);
        try {
            count = await this.userDao.deleteUser(userIdToDelete);
        }
        catch (BSONTypeError) {
            let errorMessage = "BSONType Error, userid: " + userIdToDelete + " is INCORRECT format";
            errorMessage += " \nFAILED to DELETE user";
            res.status(400).send(errorMessage);
            return;
        }
        if (count > 0) {
            res.send("SUCCESFULLY DELETED " + count.toString() + " users");
        }
        else {
            res.send("No users with _id: " + userIdToDelete + " found\n0 users deleted" )
        }

    }

    findAllUsers = async (req: Request, res: Response) => {
        const allUsers = await this.userDao.findAllUsers();
        // send response JSON
        res.json(allUsers)

    }

    findUserById = async (req: Request, res: Response) => {
        // userid comes from url input
        const userIdToFind = req.params['userid'];
        try {
            const targeted_user = await this.userDao.findUserById(userIdToFind);
            res.json(targeted_user);
        }
        catch (BSONTypeError) {
            let errorMessage = "BSONType Error, userid: " + userIdToFind + " is INCORRECT format";
            errorMessage+= " \nFAILED to GET/FIND user"
            res.status(404).send(errorMessage);
        }
    }

    findUserbyUserName = async (req: Request, res: Response) => {
        let targetUserName = '';
        const userNameTargetOne = req.body['postedBy']
        const userNameTargetTwo = req.body['username']

        if (userNameTargetOne.length == 0 || userNameTargetOne == null) {
            if (userNameTargetTwo.length > 0) {
                targetUserName = userNameTargetTwo;
            }
        }
        else if (userNameTargetTwo.length == 0 || userNameTargetTwo == null) {
            if (userNameTargetOne.length > 0) {
                targetUserName = userNameTargetOne;
            }
        }
        else {
            let errorMessage = "JSON request body requires {username: value} or {postedBy: value}";
            errorMessage += "\nusername NOT defined, UNABLE to search"
            res.status(404).send(errorMessage)
            return;
        }

        const targetedUser = await this.userDao.findUserbyUserName(targetUserName);
        res.json(targetedUser);
    }

    // updateUser = async (req: Request, res: Response) => {
    //     const userByIdtoUpdate = req.params['userid'];
    //     const updatedUserJSON = req.body;
    //
    //     let updatedUserCount = 0;
    //     try {
    //         updatedUserCount += await this.userDao.updateUser(userByIdtoUpdate, updatedUserJSON);
    //     }
    //     // if no user with userID exists send error message
    //     catch (BSONTypeError) {
    //         let errorMessage = "BSONType Error, userid: " + userByIdtoUpdate + " is INCORRECT format";
    //         errorMessage += " \nFAILED to PUT/UPDATE user";
    //         res.status(404).send(errorMessage);
    //         return;
    //     }
    //     console.log(updatedUserCount);
    //
    //     if (updatedUserCount > 0) {
    //         res.status(200);
    //         res.send("Updated " + updatedUserCount.toString() + " user(s)");
    //     }
    //     else {
    //         res.status(200);
    //         const notificationMessage = "There are no users with the _id: " + userByIdtoUpdate +"\n0 users updated";
    //         res.send(notificationMessage);
    //     }
    // }

}