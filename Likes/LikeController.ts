import {Express, Request, Response} from "express";
import LikeDao from "./LikeDao";

export default class LikeController{
    app: Express;
    likeDao: LikeDao;

    constructor(app: Express) {
        this.app = app;
        // TODO setting this attr does not seem to work, ask why
        this.likeDao = LikeDao.getInstance();

        this.app.post('/tuits/:tid/user/:uid/likes', this.createLike)
        this.app.get('/likes',this.getAllLikes)
        this.app.get('/likes/:lid', this.getLikeById)
    }

    async createLike(req: Request, res: Response) {
        const tuitId = req.params.tid;
        const userId = req.params.uid;

        const tLikeDao= LikeDao.getInstance();

        const likeObj = await tLikeDao.createLike(tuitId,userId)
        res.send(likeObj)
    }

    async getAllLikes(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const allLikes = await tLikeDao.getAllLikes();
        res.send(allLikes);
    }

    async getLikeById(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const targetedLike = await tLikeDao.getLikeById(req.params.lid)
        res.send(targetedLike)
    }


}