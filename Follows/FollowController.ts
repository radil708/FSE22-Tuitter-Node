import {Express, Request, Response} from "express";
import FollowDao from "./FollowDao";

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



    async createFollow(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();

        const followerId = req.params.rid
        const followingId = req.params.gid

        const createdFollow = await fDao.createFollow(followerId,followingId);

        res.send(createdFollow)
    }

    async getAllFollows(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const allFollows = await fDao.getAllFollows();
        res.send(allFollows)
    }

    async getFollowById(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const followId = req.params.fid
        const followObj = await fDao.findById(followId);
        res.send(followObj)
    }

    async unfollow(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const targetFollow = req.params.fid
        const numDeleted = await fDao.deleteFollow(targetFollow)
        res.send("Number of Follows Deleted: " + numDeleted.toString())
    }

    async getUsersIAmFollowing(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const myUserId = req.params.uid
        const usersIAmFollowing = await fDao.getUsersIAmFollowing(myUserId)
        res.send(usersIAmFollowing);
    }

    async getUsersFollowingMe(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();
        const usersFollowingMeArr = await fDao.getUsersFollowingMe(req.params.uid)
        res.send(usersFollowingMeArr)
    }
}