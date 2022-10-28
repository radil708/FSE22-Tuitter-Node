import {Express, Request, Response} from "express";
import LikeDao from "./LikeDao";

/**
 * This parses client requests and reads/writes data to/from the database
 * using a dao.
 */
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
        this.app.get('/users/:uid/likes', this.getAllTuitsLikedBy)
        this.app.get('/tuits/:tid/likes', this.getAllUsersThatLikedThisTuit)
        this.app.delete('/likes/:lid', this.unlike)
    }

    /**
     * Creates a new Like entry based on the client provided
     * userid and tuitId from the req.params
     * @param req
     * @param res
     */
    async createLike(req: Request, res: Response) {
        const tuitId = req.params.tid;
        const userId = req.params.uid;

        const tLikeDao= LikeDao.getInstance();

        const likeObj = await tLikeDao.createLike(tuitId,userId)
        res.send(likeObj)
    }

    /**
     * Sends every Like entry to the client
     * @param req
     * @param res
     */
    async getAllLikes(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const allLikes = await tLikeDao.getAllLikes();
        res.send(allLikes);
    }

    /**
     * Send a specific like entrty from the db to
     * the client with an id specified by the client
     * @param req
     * @param res
     */
    async getLikeById(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const targetedLike = await tLikeDao.getLikeById(req.params.lid)
        res.send(targetedLike)
    }

    /**
     * Sends all Tuits that were liked by User
     * with an id specified by the client in the req.params
     * @param req
     * @param res
     */
    async getAllTuitsLikedBy(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const allTuitsLikedByUser = await tLikeDao.getAllTuitsLikedBy(req.params.uid);
        res.send(allTuitsLikedByUser);
    }

    /**
     * Sends all the Users that liked a Tuit with an id
     * matching an id specified by the client in the req.params
     * @param req
     * @param res
     */
    async getAllUsersThatLikedThisTuit (req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const usersThatLiked = await tLikeDao.getAllUsersThatLikesThisTuit(req.params.tid)
        res.send(usersThatLiked);
    }

    /**
     * Deletes a like entry from the collection based
     * on the likeid specified by the client
     * @param req
     * @param res
     */
    async unlike(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const numDeleted = await tLikeDao.deleteLike(req.params.lid)
        const resp = "Likes Deleted = " + numDeleted.toString()
        res.send(resp)
    }


}