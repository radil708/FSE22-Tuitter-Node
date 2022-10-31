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
            followerExist = yield uDao.doesUserIdExist(followerId);
            followingExist = yield uDao.doesUserIdExist(followingId);
            if (followerExist == false) {
                serverResponse = "Follower with id: " + followerId + "does not exist";
            }
            if (followingExist == false) {
                serverResponse = "User being followed with id: " + followingId + "does not exist";
            }
            // if follower or user being followed does not exist let client know and stop here
            if (followingExist == false || followerExist == false) {
                res.send(serverResponse);
                return;
            }
            // if both are true then check if the follow already exists
            followEntryAlreadyExist = yield fDao.checkIfAlreadyFollowing(followerId, followingId);
            console.log();
            // check if entry already exist
            if (followEntryAlreadyExist == false && followingExist == true && followingExist == true) {
                serverResponse = yield fDao.createFollow(followerId, followingId);
            }
            else {
                userFollower = yield uDao.findUserById(followerId);
                userFollowed = yield uDao.findUserById(followingId);
                serverResponse = "User: " + userFollower.getUserName() + " is already following user: " + userFollowed.getUserName();
            }
            res.send(serverResponse);
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
            const followObj = yield fDao.findById(followId);
            res.send(followObj);
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
            const numDeleted = yield fDao.deleteFollow(targetFollow);
            res.send("Number of Follows Deleted: " + numDeleted.toString());
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
            const usersIAmFollowing = yield fDao.getUsersIAmFollowing(myUserId);
            res.send(usersIAmFollowing);
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
            const usersFollowingMeArr = yield fDao.getUsersFollowingMe(req.params.uid);
            res.send(usersFollowingMeArr);
        });
    }
}
exports.default = FollowController;
//# sourceMappingURL=FollowController.js.map