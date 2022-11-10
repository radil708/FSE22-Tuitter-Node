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
const FollowDao_1 = require("./FollowDao");
const UserDao_1 = require("../Users/UserDao");
/**
 * This parses client requests and reads/writes data to/from the database
 * using a dao.
 */
class FollowController {
    constructor(appIn) {
        this.app = appIn;
        this.app.post('/follower/:rid/following/:gid/follows', this.createFollow);
        this.app.get('/follows', this.getAllFollows);
        this.app.get('/follows/:fid', this.getFollowById);
        this.app.delete('/follows/:fid', this.unfollow);
        this.app.get('/follower/:uid', this.getUsersIAmFollowing);
        this.app.get('/following/:uid', this.getUsersFollowingMe);
    }
    /**
     * Add a follow entry to the database
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    createFollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            const uDao = UserDao_1.default.getInstance();
            const followerId = req.params.rid;
            const followingId = req.params.gid;
            let followerExist;
            let followingExist;
            let followEntryAlreadyExist;
            let userFollower = null;
            let userFollowed = null;
            let serverResponse;
            try {
                followerExist = yield uDao.doesUserIdExist(followerId);
            }
            catch (BSONTypeError) {
                res.json({ "Error": "format of uid of follower incorrect" });
                return;
            }
            try {
                followingExist = yield uDao.doesUserIdExist(followingId);
            }
            catch (BSONTypeError) {
                res.json({ "Error": "format of uid of following incorrect" });
                return;
            }
            if (followerExist == false) {
                serverResponse = { "Error": "Follower with id: " + followerId + "does not exist" };
            }
            if (followingExist == false) {
                serverResponse = { "Error": "User being followed with id: " + followingId + "does not exist" };
            }
            // if follower or user being followed does not exist let client know and stop here
            if (followingExist == false || followerExist == false) {
                res.json(serverResponse);
                return;
            }
            // if both are true then check if the follow already exists
            followEntryAlreadyExist = yield fDao.checkIfAlreadyFollowing(followerId, followingId);
            // check if entry already exist
            if (followEntryAlreadyExist == false && followingExist == true && followingExist == true) {
                serverResponse = yield fDao.createFollow(followerId, followingId);
            }
            else {
                userFollower = yield uDao.findUserById(followerId);
                userFollowed = yield uDao.findUserById(followingId);
                serverResponse = { "Error": "User: " + userFollower.getUserName() + " is already following user: " + userFollowed.getUserName() };
            }
            res.json(serverResponse);
        });
    }
    /**
     * Gets all the follows entries from the database
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    getAllFollows(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            const allFollows = yield fDao.getAllFollows();
            res.send(allFollows);
        });
    }
    /**
     *
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    getFollowById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            const followId = req.params.fid;
            let followObj;
            try {
                followObj = yield fDao.findById(followId);
            }
            catch (BSONTypeError) {
                followObj = { "Error": "format of fid incorrect or no entry in db with id = " + followId };
            }
            res.json(followObj);
        });
    }
    /**
     * Delete a follow by entry id
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    unfollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            const targetFollow = req.params.fid;
            let numDeleted = 0;
            let controllerResp;
            try {
                numDeleted = yield fDao.deleteFollow(targetFollow);
                controllerResp = { "followsDeleted": numDeleted.toString() };
            }
            catch (BSONTypeError) {
                controllerResp = { "Error": "Incorrect format for fid" };
            }
            res.json(controllerResp);
        });
    }
    /**
     * Get all the users that the current user is following
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    getUsersIAmFollowing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            const myUserId = req.params.uid;
            let controllerResp;
            try {
                controllerResp = yield fDao.getUsersIAmFollowing(myUserId);
            }
            catch (BSONTypeError) {
                controllerResp = { "Error": "Incorrect format for uid" };
            }
            res.json(controllerResp);
        });
    }
    /**
     * Get all users that are following the current user
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    getUsersFollowingMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            let controllerResp;
            try {
                controllerResp = yield fDao.getUsersFollowingMe(req.params.uid);
            }
            catch (BSONTypeError) {
                controllerResp = { "Error": "Incorrect format for uid" };
            }
            res.json(controllerResp);
        });
    }
}
exports.default = FollowController;
//# sourceMappingURL=FollowController.js.map