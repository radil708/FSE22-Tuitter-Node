import {Express, Request, Response} from "express";
import FollowDao from "./FollowDao";

export default class FollowController {
    app: Express

    public constructor(appIn: Express) {
        this.app = appIn;

        this.app.post('/follower/:rid/following/:gid/follows', this.createFollow)
    }



    async createFollow(req: Request, res: Response) {
        const fDao = FollowDao.getInstance();

        const followerId = req.params.rid
        const followingId = req.params.gid

        const createdFollow = await fDao.createFollow(followerId,followingId);

        res.send(createdFollow)
    }
}
