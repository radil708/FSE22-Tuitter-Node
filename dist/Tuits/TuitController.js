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
const TuitDao_1 = require("./TuitDao");
const Tuit_1 = require("./Tuit");
const UserDao_1 = require("../Users/UserDao");
const debugHelper_1 = require("../debugHelper");
//IMPORTANT LEARNIN NOTE, MAKE THESE FUNCTIONS ASYNC BECAUSE
// THEY RELY ON ASYNC METHODS, OTHERWISE WILL SEND BACK BLANK
class TuitController {
    constructor(appIn) {
        this.app = appIn;
        // TODO ask why setting attribute doesn't actually set attribute
        this.tuitDao = TuitDao_1.default.getInstance();
        this.userDao = UserDao_1.default.getInstance();
        this.app.get('/tuits', this.findAllTuits); // get all tuits
        this.app.get('/tuits/:tid', this.findTuitById); // get a specific tuit by id
        this.app.delete('/tuits/:tid', this.deleteTuit); // delete a tuit
        this.app.post('/users/:uid/tuits', this.createTuit); // create a new tuit
        this.app.get('/users/:uid/tuits', this.findTuitsByUser); // find tuits by a specific user
        // api for A3
        this.app.get('/api/tuits', this.findAllTuits); // get all tuits
        this.app.get('/api/tuits/:tid', this.findTuitById); // get a specific tuit by id
        this.app.delete('/api/tuits/:tid', this.deleteTuit); // delete a tuit
        this.app.post('/api/users/:uid/tuits', this.createTuit); // create a new tuit
        this.app.get('/api/users/:uid/tuits', this.findTuitsByUser); // find tuits by a specific user
    }
    /**
     * Parses client request to create a tuit
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    createTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all info needed to make a Tuit object
            const tuitedById = req.params.uid;
            const tuitContent = req.body.tuit;
            let tuitPostedDate = req.body.postedOn;
            let userIdExists = false;
            // create a new date if no data passed in the request body
            if (tuitPostedDate == '' || tuitPostedDate == null) {
                tuitPostedDate = new Date();
            }
            // BSON error may occur here, if userid passed is incorrect format
            try {
                userIdExists = yield UserDao_1.default.getInstance().doesUserIdExist(tuitedById);
            }
            catch (BSONTypeError) {
                let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                const errorMsg = { "Error": msg };
                res.json(errorMsg);
                return;
            }
            let controllerResp;
            let userWhoTuited;
            // if tuit property is empty send error
            if (tuitContent == '' || tuitContent == null) {
                controllerResp = "tuit property cannot be empty string or null";
                controllerResp += "\nPlease enter some value into tuit property";
                controllerResp = { "Error": controllerResp };
            }
            //user id is not in database
            else if (userIdExists == false) {
                let msg = "There are no users with id: " + tuitedById.toString() + " in the database";
                controllerResp = { "Error": msg };
            }
            else {
                userWhoTuited = yield UserDao_1.default.getInstance().findUserById(tuitedById);
                const clientTuit = new Tuit_1.default('', tuitContent, tuitPostedDate, userWhoTuited);
                controllerResp = yield TuitDao_1.default.getInstance().createTuit(clientTuit);
            }
            res.json(controllerResp);
            // Set to true to see debug statements
            const printDebug = false;
            if (printDebug) {
                console.log("client request body -> ", req.body);
                console.log("req tuit -> ", req.body.tuit);
                console.log("Does user with id: " + tuitedById + " exist?\n", userIdExists);
                console.log("Response to client:\n", controllerResp);
                debugHelper_1.default.printEnd("createTuit", "TuitController");
            }
        });
    }
    /**
     * parses client request to delete a Tuit from the database
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    deleteTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tdao = TuitDao_1.default.getInstance();
            const targetTid = req.params.tid;
            let numDeleted = 0;
            try {
                numDeleted = yield tdao.deleteTuit(targetTid);
            }
            catch (BSONTypeError) {
                let msg = "Format is incorrect for tid\n" + "tid must be a string of 12 bytes or a string of 24 hex characters or an integer";
                const errorMsg = { "Error": msg };
                res.json(errorMsg);
                return;
            }
            const printDebug = false;
            if (printDebug) {
                console.log("Request header -> ", req.params);
                console.log("Does user with id: " + targetTid + " exist?\n", numDeleted);
                console.log("Response to client:\n", { "tuitsDeleted": numDeleted });
                debugHelper_1.default.printEnd("deleteTuit", "TuitController");
            }
            // modifying to work with tests in A3
            res.json({ "tuitsDeleted": numDeleted });
        });
    }
    /**
     * Gets all tuit entries from database, converts them to Tuit objects
     * and sends them to client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    findAllTuits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield TuitDao_1.default.getInstance().findAllTuits());
        });
    }
    /**
     * Gets a tuit from db with an id matching the requested id
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    findTuitById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitdao = TuitDao_1.default.getInstance();
            const tidString = req.params.tid;
            let isTuitIdInDb = false;
            let controllerResp;
            //BSONTypeError if value passed incorrect format
            try {
                controllerResp = yield tuitdao.findTuitById(tidString);
            }
            catch (BSONTypeError) {
                controllerResp = { "Error": "Incorrect format for tid. Tid must be a string of 12 bytes or a string of 24 hex characters or an integer" };
                res.json(controllerResp);
                return;
            }
            if (controllerResp == null) {
                isTuitIdInDb = true;
                controllerResp = { "Error": "There are no tuits with the id: " + tidString };
            }
            const printDebug = false;
            if (printDebug) {
                console.log("Does user with id" + tidString + "exist? ", isTuitIdInDb);
                console.log("serverResponse: ", controllerResp);
                debugHelper_1.default.printEnd("findTuitById", "TuitController");
            }
            res.json(controllerResp);
        });
    }
    /**
     * Gets all Tuits posted by a specific user and sends them to the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    findTuitsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitdao = TuitDao_1.default.getInstance();
            let serverResponse;
            let anyMatchingUsers = false;
            try {
                serverResponse = yield tuitdao.findTuitsByUser(req.params.uid);
                anyMatchingUsers = true;
            }
            catch (BSONTypeError) {
                serverResponse = "No users with id: " + req.params.uid + " exist in the database";
            }
            if (anyMatchingUsers == false) {
                res.json();
            }
            else {
                res.json(serverResponse);
            }
        });
    }
}
exports.default = TuitController;
//# sourceMappingURL=TuitController.js.map