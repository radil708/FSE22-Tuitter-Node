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


        followerExist = await uDao.doesUserIdExist(followerId)
        followingExist = await uDao.doesUserIdExist(followingId)


        if (followerExist == false) {
            serverResponse = "Follower with id: " + followerId +"does not exist"
        }
        if (followingExist == false) {
            serverResponse = "User being followed with id: " + followingId + "does not exist"
        }

        // if follower or user being followed does not exist let client know and stop here
        if (followingExist == false || followerExist == false) {
            res.send(serverResponse)
            return
        }

        // if both are true then check if the follow already exists
        followEntryAlreadyExist = await fDao.checkIfAlreadyFollowing(followerId,followingId)
        console.log()


        // check if entry already exist
        if (followEntryAlreadyExist == false && followingExist == true && followingExist == true) {
            serverResponse = await fDao.createFollow(followerId,followingId);
        }
        else {
            userFollower = await uDao.findUserById(followerId)
            userFollowed = await uDao.findUserById(followingId)
            serverResponse = "User: " + userFollower.getUserName() + " is already following user: " + userFollowed.getUserName()
        }

        res.send(serverResponse)
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
        const followObj = await fDao.findById(followId);
        res.send(followObj)
    }

    /**
     * Delete a follow by entry id
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async unfollow(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const targetFollow = req.params.fid
        const numDeleted = await fDao.deleteFollow(targetFollow)
        res.send("Number of Follows Deleted: " + numDeleted.toString())
    }

    /**
     * Get all the users that the current user is following
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async getUsersIAmFollowing(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const myUserId = req.params.uid
        const usersIAmFollowing = await fDao.getUsersIAmFollowing(myUserId)
        res.send(usersIAmFollowing);
    }

    /**
     * Get all users that are following the current user
     * @param req {Request} an object containing the client's request
     * @param res {Response} This object is used to send data back to the client
     */
    async getUsersFollowingMe(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const usersFollowingMeArr = await fDao.getUsersFollowingMe(req.params.uid)
        res.send(usersFollowingMeArr)
    }
}
