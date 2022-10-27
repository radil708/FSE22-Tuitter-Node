import {Express, Response, Request} from "express";
import LikeDao from "./LikeDao";


export default class LikeController {
    app: Express
    likeDao: LikeDao

    constructor(appIn: Express, likeDaoIn: LikeDao) {
        this.app = appIn;
        this.likeDao = likeDaoIn;

        this.app.get('/likes', this.findAllLikes)
        this.app.post('tuit/:tid/likedBy/:uid/likes', this.createLike)
    }

    findAllLikes = async (req: Request, res: Response) => {
        const allLikes = await this.likeDao.findAllLikes();
        res.json(allLikes);
    }

    createLike = async (req: Request, res: Response) => {

        const createdLike = await this.likeDao.createLike(req.params.tid, req.params.uid);
        res.json(createdLike)
    }


}