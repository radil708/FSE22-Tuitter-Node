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
        this.app.get('/api/username/:uname/users', this.findUserByUserName) // get user by username
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

        // will be null if username already taken
        let userDaoResp = await this.userDao.createUser(newUserJSON)
        //f
        let controllerResp;

        if (userDaoResp == null) {
            const errorMsg = "The username: " + req.body.username + " is already taken" + "\n Please choose a different username"
            controllerResp = {"Error": errorMsg}
        }
        else {
            controllerResp = userDaoResp;
        }

        //Set to true to turn on debug statements
        const printDebug = false

        if (printDebug) {
            let taken;
            if (userDaoResp == null) {
                taken = false
            }
            else {
                taken = true
            }
            console.log("Is username: " + userNameInput + " already taken?\n", taken)
            console.log("Client Request body:\n", newUserJSON);
            debugHelper.printSingleLineDivider()
            console.log("DAO response:\n",controllerResp)
            debugHelper.printEnd("createUser", this.className)
        }

        res.json(controllerResp);
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
        let messageSend;

        // Error handling for incorrect format
        try {
            messageSend = await this.userDao.findUserById(userIdToFind);
        }
        catch (BSONTypeError) {
            let errMsg = "Incorrect format for userid, userid must be a string of 12 bytes or a string of 24 hex characters or an integer\n "
            res.json({"Error" : errMsg})
            return
        }


        // if no user matches send empy array
        if (messageSend == null || messageSend == undefined) {
            messageSend = "FAILED to GET user with id:" + userIdToFind
            messageSend += "\nEither user with ID does not exist\nOR\nID format is incorrect"
            const errorMsg = {"Error": messageSend};
            res.json(errorMsg)
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

        const daoResp = await this.userDao.findUserbyUserName(targetUserName)
        let controllerResp
        // user with matching username does not exist
        if (daoResp == null) {
            controllerResp = {"Error" : "There are no users with the username: " + targetUserName}
        }
        else {
            controllerResp = daoResp
            userFound = true
        }

        const printDebug = false
        if (printDebug) {
            console.log("target username: ", targetUserName);
            console.log("userFound: ", userFound)
            debugHelper.printSingleLineDivider()
            console.log("Response from dao:\n", controllerResp)
            debugHelper.printEnd("findUserByUserName", this.className)
        }

        res.json(controllerResp)

    }

    deleteUserByUserName = async (req: Request, res: Response) => {
        const usernameToDelete = req.params.uname
        const dbResp = await this.userDao.deleteUserByUserName(usernameToDelete)
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