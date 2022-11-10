import {Express, Request, Response} from "express";
import FollowDao from "./FollowDao";
import UserDao from "../Users/UserDao";

/**
 * This parses client requests and reads/writes data to/from the database
 * using a dao.
 */
export default class FollowController {
    app: Express

    public constructor(appIn: Express) {
        this.app = appIn;

        this.app.post('/follower/:rid/following/:gid/follows', this.createFollow)
        this.app.get('/follows', this.getAllFollows)
        this.app.get('/follows/:fid', this.getFollowById)
        this.app.delete('/follows/:fid', this.unfollow)
        this.app.get('/follower/:uid', this.getUsersIAmFollowing)
        this.app.get('/following/:uid', this.getUsersFollowingMe)
    }


    /**
     * Add a follow entry to the database
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async createFollow(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const uDao = UserDao.getInstance()

        const followerId = req.params.rid
        const followingId = req.params.gid

        let followerExist
        let followingExist
        let followEntryAlreadyExist
        let userFollower = null
        let userFollowed = null;
        let serverResponse

        try {
            followerExist = await uDao.doesUserIdExist(followerId)
        }
        catch (BSONTypeError) {
            res.json({"Error" : "format of uid of follower incorrect"})
            return
        }

        try {
            followingExist = await uDao.doesUserIdExist(followingId)
        }
        catch (BSONTypeError) {
            res.json({"Error" : "format of uid of following incorrect"})
            return
        }


        if (followerExist == false) {
            serverResponse = {"Error" : "Follower with id: " + followerId +"does not exist"}
        }
        if (followingExist == false) {
            serverResponse = {"Error":"User being followed with id: " + followingId + "does not exist"}
        }

        // if follower or user being followed does not exist let client know and stop here
        if (followingExist == false || followerExist == false) {
            res.json(serverResponse)
            return
        }

        // if both are true then check if the follow already exists
        followEntryAlreadyExist = await fDao.checkIfAlreadyFollowing(followerId,followingId)

        // check if entry already exist
        if (followEntryAlreadyExist == false && followingExist == true && followingExist == true) {
            serverResponse = await fDao.createFollow(followerId,followingId);
        }
        else {
            userFollower = await uDao.findUserById(followerId)
            userFollowed = await uDao.findUserById(followingId)
            serverResponse = {"Error": "User: " + userFollower.getUserName() + " is already following user: " + userFollowed.getUserName()}
        }

        res.json(serverResponse)
    }

    /**
     * Gets all the follows entries from the database
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async getAllFollows(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const allFollows = await fDao.getAllFollows();
        res.send(allFollows)
    }

    /**
     *
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async getFollowById(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const followId = req.params.fid
        let followObj;

        try {
            followObj = await fDao.findById(followId);
        }
        catch (BSONTypeError) {
            followObj = {"Error": "format of fid incorrect or no entry in db with id = " + followId }
        }
        res.json(followObj)
    }

    /**
     * Delete a follow by entry id
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async unfollow(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const targetFollow = req.params.fid
        let numDeleted = 0
        let controllerResp;
        try {
            numDeleted = await fDao.deleteFollow(targetFollow)
            controllerResp = {"followsDeleted": numDeleted.toString()}
        }
        catch (BSONTypeError) {
            controllerResp = {"Error": "Incorrect format for fid"}
        }
        res.json(controllerResp)
    }

    /**
     * Get all the users that the current user is following
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async getUsersIAmFollowing(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const myUserId = req.params.uid
        let controllerResp

        try {
            controllerResp = await fDao.getUsersIAmFollowing(myUserId)
        }
        catch (BSONTypeError) {
            controllerResp = {"Error": "Incorrect format for uid"}
        }

        res.json(controllerResp)
    }

    /**
     * Get all users that are following the current user
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async getUsersFollowingMe(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        let controllerResp

        try {
            controllerResp = await fDao.getUsersFollowingMe(req.params.uid)
        }
        catch (BSONTypeError) {
            controllerResp = {"Error": "Incorrect format for uid"}
        }

        res.json(controllerResp)
    }
}
