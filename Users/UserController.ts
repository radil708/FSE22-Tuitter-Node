import {Request, Response,Express} from "express";
import UserDao from "./UserDao";
import UserControllerInterface from "./UserControllerInterface";
import debugHelper from "../debugHelper";
import User from "./User";

/**
 * The controller will connect the get,post,delete request from clients
 * to the database via the UserDao
 */
export default class UserController implements UserControllerInterface {
    // attributes
    app: Express;
    userDao: UserDao = UserDao.getInstance();
    private className: string = "UserController" // used for debug statements

    /**
     * Singleton Architecture
     */
    constructor(app: Express) {
        this.app = app;
        // Set attributes of app attribute
        this.app.get('/users', this.findAllUsers); // get all users
        this.app.get('/users/:userid', this.findUserById); // get user by id
        this.app.get('/username/:uname/users', this.findUserByUserName) // get user by username
        this.app.post('/users', this.createUser); // create a new user
        this.app.delete('/users/:userid', this.deleteUserByID); // delete user by userid

        //Adding api, not deleting old or will break A2
        this.app.post('/api/users', this.createUser); // create a new user
        this.app.get('/api/users', this.findAllUsers); // get all users
        this.app.get('/api/users/:userid', this.findUserById); // get user by id
        this.app.delete('/api/users/:userid', this.deleteUserByID) // delete user by id
        this.app.delete('/api/users/username/:uname/delete', this.deleteUserByUserName)
        this.app.post('/api/login', this.findUserByCredential)
        //this.app.put('/users/:userid', this.updateUser);
    }

    /**
     * Creates a user in the database as defined by the client's req body.
     * It will also send back the created user to the client as a JSON
     * in the response body.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. The response body should contain
     * a JSON with the following properties:
     *      username:
     *      password:
     *      firstName:
     *      lastName:
     *      email:
     * @param res {Response} A Response object that will be used to
     * send the created user to the client
     */
    createUser = async (req: Request, res: Response) => {
        // assign variable to store POST JSON body from client
        const newUserJSON = req.body;
        const userNameInput = req.body.username
        const userNameAlreadyTaken = await this.userDao.userNameAlreadyTaken(userNameInput);
        let serverReponse

        if (!userNameAlreadyTaken) {
            serverReponse = await this.userDao.createUser(newUserJSON)
        }
        else {
            serverReponse = "The username: " + req.body.username + " is already taken"
            serverReponse += "\n Please choose a different username"
        }

        //Set to true to turn on debug statements
        const printDebug = false

        if (printDebug) {
            console.log("Is username: " + userNameInput + " already taken?\n", userNameAlreadyTaken)
            console.log("Client Request body:\n", newUserJSON);
            debugHelper.printSingleLineDivider()
            console.log("DAO response:\n",serverReponse)
            debugHelper.printEnd("createUser", this.className)
        }

        res.send(serverReponse);
    }

    /**
     * Deletes a user from the database whose userid matches the user
     * defined userid from the client's request.
     * @param req {Request}  A Request object containing the client's request
     * as an express.Request object. The req.params['userid'] needs
     * to contain the client defined userid
     * @param res {Response} A Response object that will send
     * the amount of deleted users to the client
     */
    deleteUserByID = async (req: Request, res: Response) => {
        //TODO ask, if user id should come from uri or response body
        const userIdToDelete = req.params['userid'];
        let hitError = false
        let count = 0;

        try {
            count = await this.userDao.deleteUser(userIdToDelete);
        }
        catch (BSONTypeError) {
            hitError = true
        }

        let messageSend
        if (hitError) {
            let messageSend = "BSONType Error, userid: " + userIdToDelete + " is INCORRECT format";
            messageSend += " \nFAILED to DELETE user";
        }
        else {
            let messageSend
            if (count > 0) {
                messageSend = "user with id: " + userIdToDelete + " deleted from database"
            }
            else {
                messageSend = "No users with _id: " + userIdToDelete + " found\n0 users deleted"
            }
        }

        if (hitError) {
            res.status(400).send(messageSend)
        }
        else {
            res.send(messageSend)
        }

        //Set to true to turn on debug statements
        const printDebug = false
        if (printDebug) {
            console.log("uid from client request: ", userIdToDelete)
            if (hitError) {
                console.log("BSON type error raised")
            }
            else {
                console.log(messageSend)
            }
            debugHelper.printEnd("deleteUser", this.className)
        }
    }

    /**
     * Gets all users from the database and sends them to the client
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object
     * @param res {Response} A Response object which will be used to send
     * All users from the database in the format of a JSON array to the client
     */
    findAllUsers = async (req: Request, res: Response) => {
        const allUsers = await this.userDao.findAllUsers();
        // send response JSON
        res.json(allUsers)

        //Set to true to turn on debug statements
        const printDebug = false
        if (printDebug) {
            console.log("Sending to client:\n", allUsers)
            debugHelper.printEnd("findAllUsers",this.className)
        }

    }

    /**
     * Gets a user from the database with an ID matching the ID requested
     * by a client. It will send the matching user in the response body
     * in the JSON format.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object
     * @param res {Response} A Response object that will be used to
     * send a single user with id matching the userid from the req
     * to the client
     */
    findUserById = async (req: Request, res: Response) => {
        // userid comes from url input
        const userIdToFind = req.params['userid'];

        //this should be either a user object or null if no user matching exists
        let messageSend = await this.userDao.findUserById(userIdToFind);

        // if no user matches send empy array
        if (messageSend == null || messageSend == undefined) {
            //TODO delete error message
            let messageSend = "FAILED to GET user with id:" + userIdToFind
            messageSend += "\nEither user with ID does not exist\nOR\nID format is incorrect"
            const emptyArr = [];
            res.send(emptyArr)
        }

        res.send(messageSend)


    }

    /**
     * Gets a user by their username from the database with a username matching the
     * username requested by the client. This will send the matching user
     * in the response body in JSON format.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object
     * @param res {Response} A Response object that will be used to
     * send a single user with username matching the username from the req
     * to the client
     */
    findUserByUserName = async (req: Request, res: Response) => {
        const targetUserName = req.params.uname
        let userFound = false;
        let targetedUser;

        // check if user exists
        try{
            targetedUser = await this.userDao.findUserbyUserName(targetUserName)
            userFound = true;
        }
        catch (TypeError) {
            targetedUser = '';
        }

        if (userFound) {
            res.send(targetedUser)
        }
        else {
            res.status(400).send("There are no users with the username: " + targetUserName )
        }


        const printDebug = false
        if (printDebug) {
            console.log("target username: ", targetUserName);
            console.log("userFound: ", userFound)
            debugHelper.printSingleLineDivider()
            console.log("Response from dao:\n", targetedUser)
            debugHelper.printEnd("findUserByUserName", this.className)
        }

    }

    deleteUserByUserName = async (req: Request, res: Response) => {
        const usernameToDelete = req.params.uname
        const dbResp = await this.userDao.deleteUserByUserName(usernameToDelete)
        const responseMessage = "Deleted: " + dbResp.toString() + " users with username: " + usernameToDelete
        console.log(dbResp)
        res.json({"usersDeleted": dbResp})
    }

    findUserByCredential = async (req: Request, res: Response) => {
        // username and password in body
        const uName = req.body.username
        const uPassword = req.body.password

        const daoResp = await this.userDao.findUserByCredentials(uName, uPassword)

        // no matching user send empty
        if (daoResp == null || daoResp == undefined) {
            res.status(200).send(null);
        }
        else {
            res.json(daoResp)
        }



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