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
            let userIdExists = true;
            let userWhoTuited = null;
            try {
                //TODO ask why code below does not work but code below that one does
                //userWhoTuited = await this.userDao.findUserById(tuitedById)
                userWhoTuited = yield UserDao_1.default.getInstance().findUserById(tuitedById);
            }
            catch (BSONTypeError) {
                userIdExists = false;
            }
            let serverResponse;
            if (tuitContent == '' || tuitContent == null) {
                serverResponse = "tuit property cannot be empty string or null";
                serverResponse += "\nPlease enter some value into tuit property";
            }
            // if userId not in database
            if (userIdExists == false) {
                serverResponse = 'user with id: ' + tuitedById + ' does not exist in database';
                serverResponse += '\nPlease check user id value and format';
            }
            else {
                // if date not added in body then make one for today
                if (tuitPostedDate == '' || tuitPostedDate == null) {
                    tuitPostedDate = new Date();
                }
                const clientTuit = new Tuit_1.default('', tuitContent, tuitPostedDate, userWhoTuited);
                serverResponse = yield TuitDao_1.default.getInstance().createTuit(clientTuit);
            }
            // Set to true to see debug statements
            const printDebug = true;
            if (printDebug) {
                console.log("Does user with id: " + tuitedById + " exist?\n", userIdExists);
                console.log("Response to client:\n", serverResponse);
                debugHelper_1.default.printEnd("createTuit", "TuitController");
            }
            // modifying to work with tests in A3
            if (userIdExists == false) {
                res.json();
            }
            else {
                res.json(serverResponse);
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
            const numDeleted = yield tdao.deleteTuit(targetTid);
            const stringResp = "Number of tuits deleted: " + numDeleted.toString();
            // send needs to be a string otherwise it will think status code
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
            let serverResponse;
            try {
                serverResponse = yield tuitdao.findTuitById(tidString);
                isTuitIdInDb = true;
            }
            catch (ValidationError) {
                serverResponse = "Tuit with id: " + tidString + " does not exist in database";
            }
            const printDebug = false;
            if (printDebug) {
                console.log("Does user with id" + tidString + "exist? ", isTuitIdInDb);
                console.log("serverResponse: ", serverResponse);
                debugHelper_1.default.printEnd("findTuitById", "TuitController");
            }
            // modifying for tests in A3
            if (isTuitIdInDb == false) {
                res.json();
            }
            else {
                res.send(serverResponse);
            }
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