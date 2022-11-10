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
const LikeDao_1 = require("./LikeDao");
const TuitDao_1 = require("../Tuits/TuitDao");
const UserDao_1 = require("../Users/UserDao");
/**
 * This parses client requests and reads/writes data to/from the database
 * using a dao.
 */
class LikeController {
    constructor(app) {
        this.app = app;
        // TODO setting this attr does not seem to work, ask why
        this.likeDao = LikeDao_1.default.getInstance();
        this.app.post('/tuits/:tid/user/:uid/likes', this.createLike);
        this.app.get('/likes', this.getAllLikes);
        this.app.get('/likes/:lid', this.getLikeById);
        this.app.get('/users/:uid/likes', this.getAllTuitsLikedBy);
        this.app.get('/tuits/:tid/likes', this.getAllUsersThatLikedThisTuit);
        this.app.delete('/likes/:lid', this.unlike);
    }
    /**
     * Creates a new Like entry based on the client provided
     * userid and tuitId from the req.params
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    createLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitId = req.params.tid;
            const userId = req.params.uid;
            // check if Tuit exists
            const tDao = TuitDao_1.default.getInstance();
            const uDao = UserDao_1.default.getInstance();
            let doesTuitExist;
            let doesUserExist;
            let serverResponse;
            try {
                doesTuitExist = yield tDao.doesTuitExist(tuitId);
            }
            catch (BSONTypeError) {
                serverResponse = { "Error": "Format is incorrect for tid\n" + "tid must be a string of 12 bytes or a string of 24 hex characters or an integer" };
                res.json(serverResponse);
                return;
            }
            try {
                doesUserExist = yield uDao.doesUserIdExist(userId);
            }
            catch (BSONTypeError) {
                serverResponse = { "Error": "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer" };
                res.json(serverResponse);
                return;
            }
            if (doesTuitExist == false) {
                serverResponse = "Tuit with id: " + tuitId + " does not exist";
            }
            if (doesUserExist == false) {
                serverResponse = "User with id: " + userId + " does not exist";
            }
            if (doesTuitExist == false || doesUserExist == false) {
                res.json({ "Error": serverResponse });
                return;
            }
            const tLikeDao = LikeDao_1.default.getInstance();
            const doesLikeAlreadyExist = yield tLikeDao.doesLikeEntryAlreadyExist(tuitId, userId);
            if (doesLikeAlreadyExist == true) {
                serverResponse = { "Error": "user with id: " + userId + " has already liked tuit with id: " + tuitId };
            }
            else {
                serverResponse = yield tLikeDao.createLike(tuitId, userId);
            }
            res.json(serverResponse);
        });
    }
    /**
     * Sends every Like entry to the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    getAllLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const allLikes = yield tLikeDao.getAllLikes();
            res.send(allLikes);
        });
    }
    /**
     * Send a specific like entrty from the db to
     * the client with an id specified by the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    getLikeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            let serverResponse;
            try {
                serverResponse = yield tLikeDao.getLikeById(req.params.lid);
            }
            catch (BSONTypeError) {
                serverResponse = { "Error": "Format is for lid incorrect or lid does not exist in db" };
                res.json(serverResponse);
                return;
            }
            if (serverResponse == null) {
                serverResponse = { "Error": "No entry with like id: " + req.params.lid };
            }
            res.json(serverResponse);
        });
    }
    /**
     * Sends all Tuits that were liked by User
     * with an id specified by the client in the req.params
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    getAllTuitsLikedBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const uDao = UserDao_1.default.getInstance();
            let doesUserExist;
            let controllerResp;
            try {
                doesUserExist = yield uDao.doesUserIdExist(req.params.uid);
            }
            catch (BSONTypeError) {
                controllerResp = { "Error": "Incorrect format for uid: " + req.params.uid };
                res.json(controllerResp);
                return;
            }
            let serverResponse;
            if (doesUserExist == false) {
                serverResponse = { "Error": "There is no user with id: " + req.params.uid + " in the database" };
            }
            else {
                serverResponse = yield tLikeDao.getAllTuitsLikedBy(req.params.uid);
            }
            res.json(serverResponse);
        });
    }
    /**
     * Sends all the Users that liked a Tuit with an id
     * matching an id specified by the client in the req.params
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    getAllUsersThatLikedThisTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const tDao = TuitDao_1.default.getInstance();
            let doesTuitExist;
            let controllerResp;
            try {
                doesTuitExist = yield tDao.doesTuitExist(req.params.tid);
            }
            catch (BSONTypeError) {
                controllerResp = { "Error": "Incorrect format for tid: " + req.params.tid };
                res.json(controllerResp);
                return;
            }
            if (doesTuitExist == false) {
                controllerResp = { "Error": "Tuit with id: " + req.params.tid + " does NOT exist" };
            }
            else {
                controllerResp = yield tLikeDao.getAllUsersThatLikesThisTuit(req.params.tid);
            }
            res.send(controllerResp);
        });
    }
    /**
     * Deletes a like entry from the collection based
     * on the likeid specified by the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    unlike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            let numDeleted = 0;
            try {
                numDeleted = yield tLikeDao.deleteLike(req.params.lid);
            }
            catch (BSONTypeError) {
                const errorResp = { "Error": "lid format incorrect" };
                res.json(errorResp);
                return;
            }
            const resp = { "likesDeleted": numDeleted.toString() };
            res.json(resp);
        });
    }
}
exports.default = LikeController;
//# sourceMappingURL=LikeController.js.map