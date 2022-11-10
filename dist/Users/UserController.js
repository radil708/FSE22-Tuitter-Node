"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDao_1 = require("./UserDao");
const debugHelper_1 = require("../debugHelper");
/**
 * The controller will connect the get,post,delete request from clients
 * to the database via the UserDao
 */
class UserController {
    /**
     * Singleton Architecture
     */
    constructor(app) {
        this.userDao = UserDao_1.default.getInstance();
        this.className = "UserController"; // used for debug statements
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
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // assign variable to store POST JSON body from client
            const newUserJSON = req.body;
            const userNameInput = req.body.username;
            // will be null if username already taken
            let userDaoResp = yield this.userDao.createUser(newUserJSON);
            let controllerResp;
            if (userDaoResp == null) {
                const errorMsg = "The username: " + req.body.username + " is already taken" + "\n Please choose a different username";
                controllerResp = { "Error": errorMsg };
            }
            else {
                controllerResp = userDaoResp;
            }
            //Set to true to turn on debug statements
            const printDebug = false;
            if (printDebug) {
                let taken;
                if (userDaoResp == null) {
                    taken = false;
                }
                else {
                    taken = true;
                }
                console.log("Is username: " + userNameInput + " already taken?\n", taken);
                console.log("Client Request body:\n", newUserJSON);
                debugHelper_1.default.printSingleLineDivider();
                console.log("DAO response:\n", controllerResp);
                debugHelper_1.default.printEnd("createUser", this.className);
            }
            res.json(controllerResp);
        });
        /**
         * Deletes a user from the database whose userid matches the user
         * defined userid from the client's request.
         * @param req {Request}  A Request object containing the client's request
         * as an express.Request object. The req.params['userid'] needs
         * to contain the client defined userid
         * @param res {Response} A Response object that will send
         * the amount of deleted users to the client
         */
        this.deleteUserByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //TODO ask, if user id should come from uri or response body
            const userIdToDelete = req.params['userid'];
            let hitError = false;
            let count = 0;
            try {
                count = yield this.userDao.deleteUser(userIdToDelete);
            }
            catch (BSONTypeError) {
                hitError = true;
            }
            let messageSend;
            if (hitError) {
                let messageSend = "BSONType Error, userid: " + userIdToDelete + " is INCORRECT format";
                messageSend += " \nFAILED to DELETE user";
            }
            else {
                let messageSend;
                if (count > 0) {
                    messageSend = "user with id: " + userIdToDelete + " deleted from database";
                }
                else {
                    messageSend = "No users with _id: " + userIdToDelete + " found\n0 users deleted";
                }
            }
            if (hitError) {
                res.status(400).send(messageSend);
            }
            else {
                res.send(messageSend);
            }
            //Set to true to turn on debug statements
            const printDebug = false;
            if (printDebug) {
                console.log("uid from client request: ", userIdToDelete);
                if (hitError) {
                    console.log("BSON type error raised");
                }
                else {
                    console.log(messageSend);
                }
                debugHelper_1.default.printEnd("deleteUser", this.className);
            }
        });
        /**
         * Gets all users from the database and sends them to the client
         * @param req {Request} A Request object containing the client's request
         * as an express.Request object
         * @param res {Response} A Response object which will be used to send
         * All users from the database in the format of a JSON array to the client
         */
        this.findAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.userDao.findAllUsers();
            // send response JSON
            res.json(allUsers);
            //Set to true to turn on debug statements
            const printDebug = false;
            if (printDebug) {
                console.log("Sending to client:\n", allUsers);
                debugHelper_1.default.printEnd("findAllUsers", this.className);
            }
        });
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
        this.findUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // userid comes from url input
            const userIdToFind = req.params['userid'];
            //this should be either a user object or null if no user matching exists
            let messageSend;
            // Error handling for incorrect format
            try {
                messageSend = yield this.userDao.findUserById(userIdToFind);
            }
            catch (BSONTypeError) {
                let errMsg = "Incorrect format for userid, userid must be a string of 12 bytes or a string of 24 hex characters or an integer\n ";
                res.json({ "Error": errMsg });
                return;
            }
            // if no user matches send empy array
            if (messageSend == null || messageSend == undefined) {
                messageSend = "FAILED to GET user with id:" + userIdToFind;
                messageSend += "\nEither user with ID does not exist\nOR\nID format is incorrect";
                const errorMsg = { "Error": messageSend };
                res.json(errorMsg);
            }
            res.send(messageSend);
        });
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
        this.findUserByUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const targetUserName = req.params.uname;
            let userFound = false;
            let targetedUser;
            const daoResp = yield this.userDao.findUserbyUserName(targetUserName);
            let controllerResp;
            // user with matching username does not exist
            if (daoResp == null) {
                controllerResp = { "Error": "There are no users with the username: " + targetUserName };
            }
            else {
                controllerResp = daoResp;
                userFound = true;
            }
            const printDebug = false;
            if (printDebug) {
                console.log("target username: ", targetUserName);
                console.log("userFound: ", userFound);
                debugHelper_1.default.printSingleLineDivider();
                console.log("Response from dao:\n", controllerResp);
                debugHelper_1.default.printEnd("findUserByUserName", this.className);
            }
            res.json(controllerResp);
        });
        this.deleteUserByUserName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const usernameToDelete = req.params.uname;
            const dbResp = yield this.userDao.deleteUserByUserName(usernameToDelete);
            res.json({ "usersDeleted": dbResp });
        });
        this.findUserByCredential = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // username and password in body
            const uName = req.body.username;
            const uPassword = req.body.password;
            const daoResp = yield this.userDao.findUserByCredentials(uName, uPassword);
            // no matching user send empty
            if (daoResp == null || daoResp == undefined) {
                res.status(200).send(null);
            }
            else {
                res.json(daoResp);
            }
        });
        this.app = app;
        // Set attributes of app attribute
        this.app.get('/users', this.findAllUsers); // get all users
        this.app.get('/users/:userid', this.findUserById); // get user by id
        this.app.get('/username/:uname/users', this.findUserByUserName); // get user by username
        this.app.post('/users', this.createUser); // create a new user
        this.app.delete('/users/:userid', this.deleteUserByID); // delete user by userid
        //Adding api, not deleting old or will break A2
        this.app.post('/api/users', this.createUser); // create a new user
        this.app.get('/api/users', this.findAllUsers); // get all users
        this.app.get('/api/users/:userid', this.findUserById); // get user by id
        this.app.get('/api/username/:uname/users', this.findUserByUserName); // get user by username
        this.app.delete('/api/users/:userid', this.deleteUserByID); // delete user by id
        this.app.delete('/api/users/username/:uname/delete', this.deleteUserByUserName);
        this.app.post('/api/login', this.findUserByCredential);
        //this.app.put('/users/:userid', this.updateUser);
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map